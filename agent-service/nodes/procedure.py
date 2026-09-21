from state import AdmissionState
from tools.hospital_tools import get_procedure_protocol


def procedure_node(state: AdmissionState):
    procedure_code = state.get("procedure_code")
    if not procedure_code:
        return {"errors": ["No procedure code provided in state"]}

    try:
        procedure = get_procedure_protocol(procedure_code)
        return {"procedure": procedure}
    except Exception as e:
        return {"errors": [f"Procedure lookup failed: {str(e)}"]}
