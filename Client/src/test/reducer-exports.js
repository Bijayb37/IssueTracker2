import { combineReducers } from "redux"
import currentUser from "./test-auth-reducer"
import errors from "./test-error-reducer"
import projects from "./test-project-reducer"

const allProjectsReducer = combineReducers({
  projects,
  currentUser,
  errors
})

export { allProjectsReducer }
