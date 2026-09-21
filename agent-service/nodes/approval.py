from langgraph.types import interrupt
from state import AdmissionState


def human_approval_node(state: AdmissionState):
    decision = interrupt({
        "message": "Please review the admission plan",
        "admission_plan": state.get("admission_plan")
    })

    if isinstance(decision, dict):
        return {
            "approved": decision.get("approved", False),
            "approval_notes": decision.get("notes", "")
        }

    return {
        "approved": bool(decision),
        "approval_notes": str(decision)
    }