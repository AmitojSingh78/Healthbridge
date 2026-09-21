from state import AdmissionState
from tools.patient_tools import search_patient


def patient_node(state: AdmissionState):
    patient_name = state.get("patient_name")
    if not patient_name:
        return {"errors": ["No patient name provided in state"]}

    try:
        patient = search_patient(patient_name)
        return {"patient": patient}
    except Exception as e:
        return {"errors": [f"Patient lookup failed: {str(e)}"]}