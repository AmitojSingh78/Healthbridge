from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from state import AdmissionState

from nodes.planner import planner_node
from nodes.patient import patient_node
from nodes.doctor import doctor_node
from nodes.procedure import procedure_node
from nodes.bed import bed_node
from nodes.ot import ot_node
from nodes.labs import labs_node
from nodes.lab_draft import prepare_lab_orders_node
from nodes.insurance import insurance_node
from nodes.plan import plan_node
from nodes.approval import human_approval_node


def route_after_labs(state: AdmissionState):
    missing_tests = state.get("missing_tests", [])
    if len(missing_tests) > 0:
        return "missing"
    return "clear"


def tests_clear_node(state: AdmissionState):
    return {}


builder = StateGraph(AdmissionState)

# 1. Register all nodes
builder.add_node("planner", planner_node)
builder.add_node("patient", patient_node)
builder.add_node("doctor", doctor_node)
builder.add_node("procedure", procedure_node)
builder.add_node("bed", bed_node)
builder.add_node("ot", ot_node)
builder.add_node("labs", labs_node)
builder.add_node("prepare_labs", prepare_lab_orders_node)
builder.add_node("tests_clear", tests_clear_node)
builder.add_node("insurance", insurance_node)
builder.add_node("plan", plan_node)
builder.add_node("approval", human_approval_node)

# 2. Sequential linear pipeline
builder.add_edge(START, "planner")
builder.add_edge("planner", "patient")
builder.add_edge("patient", "doctor")
builder.add_edge("doctor", "procedure")
builder.add_edge("procedure", "bed")
builder.add_edge("bed", "ot")
builder.add_edge("ot", "labs")

# 3. Labs conditional branching
builder.add_conditional_edges(
    "labs",
    route_after_labs,
    {
        "missing": "prepare_labs",
        "clear": "tests_clear",
    },
)

# 4. Reconverge to Insurance check
builder.add_edge("prepare_labs", "insurance")
builder.add_edge("tests_clear", "insurance")

# 5. Build admission plan
builder.add_edge("insurance", "plan")

# 6. Human approval interrupt
builder.add_edge("plan", "approval")

# 7. Post-approval completion
builder.add_edge("approval", END)

# Checkpointer enabling interrupt/resume functionality
checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)
workflow = graph