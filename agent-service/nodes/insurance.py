from state import AdmissionState
from tools.patient_tools import get_patient_insurance


def insurance_node(state: AdmissionState):
    patient = state.get("patient")

    if not patient:
        return {
            "insurance": None,
            "errors": ["Patient data not available for insurance check"]
        }

    patient_id = patient.get("_id")

    try:
        insurance = get_patient_insurance(patient_id)
        return {"insurance": insurance}
    except Exception as e:
        return {
            "insurance": None,
            "errors": [f"Insurance check failed: {str(e)}"]
        }