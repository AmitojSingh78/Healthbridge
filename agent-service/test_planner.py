from nodes.planner import planner_node


state = {
    "request":
        "Admit Aditi Sharma tomorrow for knee replacement with Dr Vikram Singh"
}


result = planner_node(state)

print(result)