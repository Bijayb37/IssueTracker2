import { apiCall } from "../../services/api"
import {
  ADD_ISSUE,
  LOAD_ISSUES,
  REMOVE_ISSUES,
  UPDATE_ISSUES,
} from "../actionTypes"
import { addError, removeError } from "./errorActions"

//api call syntax apiCall(method, path, payload)
function loadIssues(issues) {
  return {
    type: LOAD_ISSUES,
    issues,
  }
}

function updateIssue(id, newIssue) {
  return {
    type: UPDATE_ISSUES,
    id,
    issue: newIssue,
  }
}

function removeIssue(id) {
  return {
    type: REMOVE_ISSUES,
    id,
  }
}

function addIssue(issue) {
  return {
    type: ADD_ISSUE,
    issue,
  }
}

export function getIssues() {
  return (dispatch) => {
    apiCall("get", "/api/issues").then((res) => {
      dispatch(loadIssues(res))
    })
  }
}

export function getIssueHistory() {
  return (dispatch) => {
    apiCall("get", "/api/issues/history").then((res) => {
      console.log(res)
    })
  }
}

export function postIssue(issueData, projectId, closeModal) {
  return async (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("post", `/api/users/${id}/issues/${projectId}/create`, issueData)
      .then((res) => {
        dispatch(removeError())
        dispatch(addIssue(res))
        closeModal()
      })
      .catch((err) => {
        dispatch(addError(err.message))
      })
  }
}

export function patchIssue(issueId, issueData, issueDifferences, closeModal) {
  return (dispatch, getState) => {
      const { currentUser } = getState()
      const { id } = currentUser.user
      apiCall("patch", `/api/users/${id}/issues/${issueId}`, {
        issueData,
        issueDifferences,
      })
        .then((res) => {
          dispatch(updateIssue(res.issue._id, res.issue))
          dispatch(removeError())
          closeModal()
        })
        .catch((err) => {
          dispatch(addError(err.message))
        })
  }
}

export function deleteIssue(issueId) {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("delete", `/api/users/${id}/issues/${issueId}`)
      .then((res) => {
        dispatch(removeIssue(res.issue._id))
      })
      .catch((err) => console.log(err.message))
  }
}

export function updateIssueStatus(issueId, type) {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("post", `/api/users/${id}/issues/${issueId}/${type}`)
      .then((res) => {
        console.log(res.issue)
        dispatch(updateIssue(res.issue._id, res.issue))
      })
      .catch((err) => console.log(err))
  }
}

export function postComment(issueId, comment) {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("post", `/api/users/${id}/issues/${issueId}/comment`, { comment })
      .then((res) => {
        dispatch(updateIssue(res.issue._id, res.issue))
      })
      .catch((err) => console.log(err))
  }
}

export function patchComment(issueId, commentId, comment) {
  console.log(commentId)
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall(
      "patch",
      `/api/users/${id}/issues/${issueId}/comment/${commentId}`,
      { comment }
    )
      .then((res) => {
        dispatch(updateIssue(res.issue._id, res.issue))
      })
      .catch((err) => console.log(err))
  }
}

export function deleteComment(commentId, issueId) {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("delete", `/api/users/${id}/issues/${issueId}/comment/${commentId}`)
      .then((res) => {
        dispatch(updateIssue(res.issue._id, res.issue))
      })
      .catch((err) => console.log(err))
  }
}

export function leaveIssue(issueId, history) {
  return (dispatch, getState) => {
    const { currentUser } = getState()
    const { id } = currentUser.user
    apiCall("patch", `/api/users/${id}/issues/${issueId}/leave`)
      .then((res) => {
        dispatch(updateIssue(res.issue._id, res.issue))
        history && history.push("/projects")
      })
      .catch((err) => {
        dispatch(addError(err.message))
      })
  }
}
