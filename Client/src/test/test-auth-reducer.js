import { SET_CURRENT_USER } from "../store/actionTypes"

const defaultState = {
    isAuthenticated: true,
    user: {
      id: 1,
    }
}

const testAuthReducer = (state = defaultState, action) => {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: Boolean(Object.keys(action.user).length),
                user: action.user
            }
        default: 
            return state
    }
}

export default testAuthReducer