from state import AdmissionState
from tools.hospital_tools import get_available_beds


def bed_node(state: AdmissionState):
    procedure = state.get("procedure")
    if not procedure:
        return {"errors": ["Procedure data not available"]}

    ward = procedure.get("requiredBedType")
    if not ward:
        return {"errors": ["Required bed type not specified in procedure protocol"]}

    try:
        beds = get_available_beds(ward)
        if not beds:
            return {
                "available_beds": [],
                "selected_bed": None,
                "errors": [f"No available beds found in {ward} ward"]
            }

        return {
            "available_beds": beds,
            "selected_bed": beds[0]
        }
    except Exception as e:
        return {"errors": [f"Bed availability check failed: {str(e)}"]}