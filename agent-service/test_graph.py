from langgraph.types import Command
from graph import workflow

initial_state = {
    "request": "Admit Aditi Sharma tomorrow for knee replacement with Dr Vikram Singh",
    "errors": [],
}

config = {"configurable": {"thread_id": "test-admission-001"}}

print("=== 1. Starting workflow ===")
result = workflow.invoke(initial_state, config=config)

if "__interrupt__" in result:
    print("\n=== Workflow interrupted for Human Approval! ===")
    interrupt_data = result["__interrupt__"][0].value
    print("Interrupt Message:", interrupt_data.get("message"))
    print("Admission Plan:", interrupt_data.get("admission_plan"))

    print("\n=== 2. Simulating Doctor Approval ===")
    approval_decision = {
        "approved": True,
        "notes": "Approved by Dr. Vikram Singh for tomorrow morning slot.",
    }
    final_result = workflow.invoke(
        Command(resume=approval_decision), config=config
    )

    print("\n=== 3. Workflow Completed Successfully ===")
    print("Approved:", final_result.get("approved"))
    print("Approval Notes:", final_result.get("approval_notes"))
    print("Admission Plan:", final_result.get("admission_plan"))
else:
    print("Result without interrupt:", result)