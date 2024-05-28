import axios from "axios"
const initialState = {
    employees: [],
    roles: []
}
const Reducer = (state = initialState, action) => {

    switch (action.type) {

        case 'GET_EMPLOYEES':
            return { ...state, employees: action.payload }

        case 'ADD_EMPLOYEE':
            return { ...state, employees: [...state.employees, action.payload] }
        case 'GET_ROLLS':
            console.log(action.payload, "pay");
            return { ...state, roles: action.payload }
        case 'ADD_ROLL':
            console.log(state.roles,"rollAdd");
            return { ...state, roles: [...state.roles, action.payload] }
        default:
            return state;
    }




}
export default Reducer;