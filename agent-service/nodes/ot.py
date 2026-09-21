from state import AdmissionState
from tools.hospital_tools import get_available_ots


def ot_node(state: AdmissionState):
    procedure_code = state.get("procedure_code")
    requested_date = state.get("requested_date")

    if not procedure_code or not requested_date:
        return {"errors": ["Procedure code or requested date missing in state"]}

    try:
        available_ots = get_available_ots(procedure_code, requested_date)

        if not available_ots:
            return {
                "available_ots": [],
                "selected_ot": None,
                "errors": [
                    f"No OT available for {procedure_code} on {requested_date}"
                ]
            }

        first_ot = available_ots[0]
        first_slot = first_ot.get("availableSlots", [{}])[0]

        selected_ot = {
            "otId": first_ot.get("otId"),
            "OTName": first_ot.get("OTName"),
            "slotId": first_slot.get("_id"),
            "date": first_slot.get("date"),
            "startTime": first_slot.get("startTime"),
            "endTime": first_slot.get("endTime"),
        }

        return {
            "available_ots": available_ots,
            "selected_ot": selected_ot
        }

    except Exception as e:
        return {"errors": [f"OT availability check failed: {str(e)}"]}