import axios from "axios"
import jwtDecode from "jwt-decode"
import { apiCall } from "../../services/api"
import { SET_CURRENT_USER } from "../actionTypes"
import { addError, removeError } from "./errorActions"
import { getIssues } from "./issueActions"
import { getProjects } from "./projectActions"
import { getUsers } from "./userActions"

export function setUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  }
}

export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

export function logout() {
  return (dispatch) => {
    localStorage.clear()
    setTokenHeader(false)
    dispatch(setUser({}))
  }
}

export function autoLogin() {
  return (dispatch) => {
    if (localStorage.jwt) {
      try {
        setTokenHeader(localStorage.jwt)
        dispatch(setUser(jwtDecode(localStorage.jwt)))
        dispatch(getProjects())
        dispatch(getUsers())
        dispatch(getIssues())
      } catch (err) {
        dispatch(setUser({}))
      }
    }
  }
}

export function authUser(type, userData, setLoading) {
  return (dispatch) => {
    dispatch(removeError())
    apiCall("post", `/api/auth/${type}`, userData)
      .then(({ token, ...userInfo }) => {
        localStorage.setItem("jwt", token)
        setTokenHeader(token)
        dispatch(setUser(userInfo))
        dispatch(removeError())
        dispatch(getProjects())
        dispatch(getUsers())
        dispatch(getIssues())
        setLoading(false)
      })
      .catch((err) => {
        dispatch(addError(err.message))
        setLoading(false)
      })
  }
}
