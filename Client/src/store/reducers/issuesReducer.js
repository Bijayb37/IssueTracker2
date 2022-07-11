import {
  ADD_ISSUE,
  LOAD_ISSUES,
  REMOVE_ISSUES,
  UPDATE_ISSUES,
} from "../actionTypes"

const issueReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_ISSUES:
      return [...action.issues]
    case ADD_ISSUE:
      return [...state, action.issue]
    case REMOVE_ISSUES:
      return state.filter((issue) => issue._id !== action.id)
    case UPDATE_ISSUES:
      return state.map((issue) =>
        issue._id === action.id ? { ...action.issue } : issue
      )
    default:
      return state
  }
}
export default issueReducer
