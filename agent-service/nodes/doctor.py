from state import AdmissionState
from tools.doctor_tools import check_doctor_availability


def doctor_node(state: AdmissionState):
    doctor_name = state.get("doctor_name")
    requested_date = state.get("requested_date")

    if not doctor_name or not requested_date:
        return {"errors": ["Doctor name or requested date missing in state"]}

    try:
        result = check_doctor_availability(doctor_name, requested_date)
        return {
            "doctor": result.get("doctor"),
            "doctor_available": result.get("available", False)
        }
    except Exception as e:
        return {"errors": [f"Doctor availability check failed: {str(e)}"]}