import os
from datetime import date
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_groq import ChatGroq

from state import AdmissionState
load_dotenv()
class PlannerOutput(BaseModel):
    patient_name: str
    doctor_name: str
    procedure_code: str
    requested_date: str
    
llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0
)
structured_llm = llm.with_structured_output(
    PlannerOutput
)

def planner_node(state:AdmissionState):
    request = state["request"]
    today = date.today().isoformat()
    prompt = f"""
You are a hospital admission workflow planner.

Today's date is {today}.

Extract the following information from the user's request:

- patient_name
- doctor_name
- procedure_code
- requested_date

Rules:

1. Convert procedure names into uppercase snake case.

Example:
"Knee Replacement"
-> "KNEE_REPLACEMENT"

2. Convert relative dates like:
today
tomorrow

into YYYY-MM-DD format.

3. Do not add extra information.

User request:
{request}
"""
    result = structured_llm.invoke(prompt)
    return {
        "patient_name": result.patient_name,
        "doctor_name": result.doctor_name,
        "procedure_code": result.procedure_code,
        "requested_date": result.requested_date
    }