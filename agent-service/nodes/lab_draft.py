from state import AdmissionState


def prepare_lab_orders_node(state: AdmissionState):

    missing_tests = state.get(
        "missing_tests",
        []
    )

    return {
        "draft_lab_orders": missing_tests
    }