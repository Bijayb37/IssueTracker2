import { combineReducers } from "redux"
import issues from "./issuesReducer"
import currentUser from "./authReducer"
import errors from "./errorReducer"
import projects from "./projectReducer"
import users from "./userReducer"

const rootReducer = combineReducers({
  issues,
  currentUser,
  errors,
  projects,
  users,
})

export default rootReducer
