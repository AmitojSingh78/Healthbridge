from state import AdmissionState


def plan_node(state: AdmissionState):

    patient = state.get("patient")
    doctor = state.get("doctor")
    procedure = state.get("procedure")
    selected_bed = state.get("selected_bed")
    selected_ot = state.get("selected_ot")
    missing_tests = state.get("missing_tests", [])
    draft_lab_orders = state.get("draft_lab_orders", [])
    insurance = state.get("insurance")

    plan = {
        "patient": {
            "id": patient.get("_id") if patient else None,
            "name": patient.get("name") if patient else None,
        },

        "doctor": {
            "id": doctor.get("id") if doctor else None,
            "name": doctor.get("name") if doctor else None,
            "specialization": doctor.get("specialization") if doctor else None,
        },

        "procedure": {
            "code": procedure.get("code") if procedure else None,
            "name": procedure.get("name") if procedure else None,
        },

        "admissionDate": state.get("requested_date"),

        "bed": selected_bed,

        "operationTheatre": selected_ot,

        "missingTests": missing_tests,

        "draftLabOrders": draft_lab_orders,

        "insurance": insurance,

        "doctorAvailable": state.get("doctor_available"),
    }

    return {
        "admission_plan": plan
    }