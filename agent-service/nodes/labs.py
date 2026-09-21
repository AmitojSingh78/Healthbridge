from state import AdmissionState
from tools.patient_tools import get_patient_lab_orders


def labs_node(state: AdmissionState):
    patient = state.get("patient")
    procedure = state.get("procedure")

    if not patient:
        return {"errors": ["Patient data not available"]}

    if not procedure:
        return {"errors": ["Procedure data not available"]}

    patient_id = patient.get("_id")
    required_tests = procedure.get("requiredTests", [])

    try:
        lab_orders = get_patient_lab_orders(patient_id)

        completed_tests = []
        for lab in lab_orders:
            if lab.get("status") == "completed":
                completed_tests.append(lab.get("testName"))

        missing_tests = []
        for test in required_tests:
            if test not in completed_tests:
                missing_tests.append(test)

        return {
            "completed_tests": completed_tests,
            "missing_tests": missing_tests
        }

    except Exception as e:
        return {"errors": [f"Lab check failed: {str(e)}"]}