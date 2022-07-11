import { SET_CURRENT_USER } from "../actionTypes"

const defaultState = {
  isAuthenticated: false,
  user: {},
}

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: Boolean(Object.keys(action.user).length),
        user: action.user,
      }
    default:
      return state
  }
}

export default authReducer
