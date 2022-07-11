import { REMOVE_ERROR, ADD_ERROR } from "../actionTypes"

export function addError(error) {
  return {
    type: ADD_ERROR,
    errorMessage: error,
  }
}

export function removeError() {
  return {
    type: REMOVE_ERROR,
  }
}

export function clearErrors() {
  return (dispatch) => {
    dispatch(removeError())
  }
}
