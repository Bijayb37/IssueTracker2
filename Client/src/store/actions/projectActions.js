import { apiCall } from "../../services/api"
import {
  ADD_PROJECT,
  LOAD_PROJECTS,
  REMOVE_PROJECTS,
  UPDATE_PROJECTS,
} from "../actionTypes"
import { addError, removeError } from "./errorActions"
//api call syntax apiCall(method, path, payload)

function loadProjects(projects) {
  return {
    type: LOAD_PROJECTS,
    projects,
  }
}

function addProject(project) {
  return {
    type: ADD_PROJECT,
    project,
  }
}

function updateProject(newProject) {
  return {
    type: UPDATE_PROJECTS,
    project: newProject,
  }
}

function removeProject(id) {
  return {
    type: REMOVE_PROJECTS,
    id,
  }
}

export function getProjects() {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("get", `/${id}/api/projects`)
      .then((res) => dispatch(loadProjects(res)))
      .catch((err) => dispatch(addError(err.message)))
  }
}

export function postProject(projectData, closeModal) {
  return (dispatch, getState) => {
      const { currentUser } = getState()
      const { id } = currentUser.user
      apiCall("post", `/api/users/${id}/projects`, projectData)
        .then((res) => {
          dispatch(removeError())
          dispatch(addProject(res))
          closeModal()
        })
        .catch((err) => {
          dispatch(addError(err.message))
        })
  }
}

export function patchProject(
  projectId,
  projectData,
  projectDifferences,
  closeModal
) {
  return (dispatch, getState) => {
      const { currentUser } = getState()
      const { id } = currentUser.user
      apiCall("patch", `/api/users/${id}/projects/${projectId}`, {
        projectData,
        projectDifferences,
      })
        .then((res) => {
          dispatch(updateProject(res.project))
          closeModal()
        })
        .catch((err) => {
          dispatch(addError(err.message))
        })
  }
}

export function deleteProject(projectId, history) {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("delete", `/api/users/${id}/projects/${projectId}`)
      .then((res) => {
        dispatch(removeProject(res.project._id))
        history && history.push("/projects")
      })
      .catch((err) => {
        dispatch(addError(err.message))
      })
  }
}

export function leaveProject(projectId, history) {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("patch", `/api/users/${id}/projects/${projectId}/leave`)
      .then((res) => {
        dispatch(removeProject(res.project._id))
        history && history.push("/projects")
      })
      .catch((err) => {
        dispatch(addError(err.message))
      })
  }
}
