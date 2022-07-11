import {
  ADD_PROJECT,
  LOAD_PROJECTS,
  REMOVE_PROJECTS,
  UPDATE_PROJECTS,
  REMOVE_USER_FROM_PROJECT,
} from "../actionTypes"

const projectReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_PROJECTS:
      return [...action.projects]
    case ADD_PROJECT:
      return [...state, action.project]
    case REMOVE_PROJECTS:
      return state.filter((project) => project._id !== action.id)
    case UPDATE_PROJECTS:
      return state.map((project) =>
        project._id === action.project._id ? { ...action.project } : project
      )
    case REMOVE_USER_FROM_PROJECT:
      return state.assignedUsers.filter((users) => users)
    default:
      return state
  }
}

export default projectReducer
