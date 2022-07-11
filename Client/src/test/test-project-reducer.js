import {
  ADD_PROJECT,
  LOAD_PROJECTS,
  REMOVE_PROJECTS,
  UPDATE_PROJECTS,
  REMOVE_USER_FROM_PROJECT,
} from "../store/actionTypes"

const initialProjectState = [
  {
    assignedUsers: [],
    createdAt: "2022-01-13T02:47:02.799Z",
    createdBy: {
      _id: "618f20bed071a20016107894",
      username: "guest",
      email: "guest@gmail.com",
    },
    description: "Test Project",
    history: [],
    issues: [],
    projectName: "Guest Project",
    targetEndDate: "2022-01-20T00:00:00.000Z",
    updatedAt: "2022-06-20T05:15:30.470Z",
  },
]

const testProjectReducer = (state = initialProjectState, action) => {
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

export default testProjectReducer
