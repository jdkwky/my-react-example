const initialState = {
    todos: []
}

function  todoApp(state = initialState,{ type , payload }) {
    switch (type) {
        case "ADD_TODO":
            const { value } = payload||{};
            const todos = state.todos;
            todos.push(value);
            return {
                ...state,
                todos: todos
            }
    
        default:
            return state;
    }
    return state;
}

export default todoApp;