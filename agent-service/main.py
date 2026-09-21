import os
import uuid
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langgraph.types import Command

from graph import workflow
from medicine_finder import run_medicine_finder_agent

app = FastAPI(
    title="HealthBridge Admission Agent & Medicine Finder Service",
    description="LangGraph AI agent orchestrating clinical hospital admissions and LangChain medicine finder agent.",
    version="1.0.0",
)

# Enable CORS for frontend and Node.js backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AdmissionRunRequest(BaseModel):
    request: str
    thread_id: Optional[str] = None


class AdmissionApprovalRequest(BaseModel):
    thread_id: str
    approved: bool
    notes: Optional[str] = ""


class MedicineSearchRequest(BaseModel):
    query: str
    country: Optional[str] = "India"


@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "HealthBridge Agent Service (Admissions & Medicine Finder)",
        "version": "1.0.0",
    }


@app.post("/medicine/search")
def search_medicine(payload: MedicineSearchRequest):
    """
    Executes LangChain AI Agent with DuckDuckGo Search to find medicine details,
    clinical indications, active composition, substitutes, and direct verified pharmacy buy links.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Medicine search query cannot be empty")

    try:
        result = run_medicine_finder_agent(payload.query, country=payload.country or "India")
        return {
            "success": True,
            "data": result.model_dump()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error running medicine search agent: {str(e)}"
        )


@app.get("/medicine/suggestions")
def get_medicine_suggestions():
    """
    Returns popular and trending medicine search queries.
    """
    return {
        "success": True,
        "suggestions": [
            {"name": "Dolo 650", "category": "Fever & Pain Relief", "generic": "Paracetamol 650mg"},
            {"name": "Augmentin 625 Duo", "category": "Antibiotic", "generic": "Amoxicillin + Clavulanic Acid"},
            {"name": "Pantocid 40", "category": "Acidity & GERD", "generic": "Pantoprazole 40mg"},
            {"name": "Allegra 120", "category": "Allergy Relief", "generic": "Fexofenadine 120mg"},
            {"name": "Metformin 500 SR", "category": "Diabetes Care", "generic": "Metformin Hydrochloride"},
            {"name": "Telmisartan 40", "category": "Blood Pressure", "generic": "Telmisartan 40mg"},
            {"name": "Combiflam", "category": "Pain & Inflammation", "generic": "Ibuprofen + Paracetamol"},
            {"name": "Azithral 500", "category": "Antibiotic", "generic": "Azithromycin 500mg"},
        ]
    }


@app.post("/admission/run")
def run_admission_agent(payload: AdmissionRunRequest):
    """
    Triggers the admission workflow graph with a natural language admission request.
    Extracts requirements, checks patient, doctor, beds, OT, labs, insurance,
    and pauses at human approval with an admission plan.
    """
    if not payload.request.strip():
        raise HTTPException(status_code=400, detail="Request text cannot be empty")

    thread_id = payload.thread_id or f"run_{uuid.uuid4().hex[:12]}"
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "request": payload.request,
        "errors": [],
    }

    try:
        result = workflow.invoke(initial_state, config=config)

        # Check if interrupted for human approval
        if "__interrupt__" in result:
            interrupt_info = result["__interrupt__"][0].value
            plan = interrupt_info.get("admission_plan") or result.get("admission_plan")
            return {
                "success": True,
                "thread_id": thread_id,
                "status": "awaiting_approval",
                "message": interrupt_info.get("message", "Awaiting clinical approval"),
                "admission_plan": plan,
                "patient_name": result.get("patient_name"),
                "doctor_name": result.get("doctor_name"),
                "procedure_code": result.get("procedure_code"),
                "requested_date": result.get("requested_date"),
                "errors": result.get("errors", []),
            }

        return {
            "success": True,
            "thread_id": thread_id,
            "status": "completed",
            "state": result,
            "admission_plan": result.get("admission_plan"),
            "errors": result.get("errors", []),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing admission workflow: {str(e)}"
        )


@app.post("/admission/approve")
def approve_admission_plan(payload: AdmissionApprovalRequest):
    """
    Submits the doctor/admin decision (Approve / Reject) to resume
    the interrupted graph workflow.
    """
    config = {"configurable": {"thread_id": payload.thread_id}}

    # Verify that the thread exists and is currently waiting for input
    state_snapshot = workflow.get_state(config)
    if not state_snapshot.values:
        raise HTTPException(
            status_code=404,
            detail=f"Workflow thread '{payload.thread_id}' not found or has no recorded state"
        )

    approval_payload = {
        "approved": payload.approved,
        "notes": payload.notes or ("Approved" if payload.approved else "Rejected"),
    }

    try:
        final_result = workflow.invoke(
            Command(resume=approval_payload),
            config=config
        )

        status = "approved" if payload.approved else "rejected"
        return {
            "success": True,
            "thread_id": payload.thread_id,
            "status": status,
            "approved": payload.approved,
            "approval_notes": payload.notes,
            "admission_plan": final_result.get("admission_plan"),
            "errors": final_result.get("errors", []),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing approval decision: {str(e)}"
        )


@app.get("/admission/status/{thread_id}")
def get_admission_status(thread_id: str):
    """
    Fetches the current state snapshot for a given workflow thread.
    """
    config = {"configurable": {"thread_id": thread_id}}
    snapshot = workflow.get_state(config)

    if not snapshot.values:
        raise HTTPException(
            status_code=404,
            detail=f"No active or completed admission workflow found for thread '{thread_id}'"
        )

    is_interrupted = len(snapshot.next) > 0 and snapshot.next[0] == "approval"
    status = "awaiting_approval" if is_interrupted else "completed"

    return {
        "success": True,
        "thread_id": thread_id,
        "status": status,
        "next_step": snapshot.next,
        "admission_plan": snapshot.values.get("admission_plan"),
        "approved": snapshot.values.get("approved"),
        "approval_notes": snapshot.values.get("approval_notes"),
        "errors": snapshot.values.get("errors", []),
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
