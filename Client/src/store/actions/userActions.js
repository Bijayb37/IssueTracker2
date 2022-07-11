import { addError } from "../actions/errorActions"
import { apiCall } from "../../services/api"
import { LOAD_USERS } from "../actionTypes"

function loadUsers(users) {
  return {
    type: LOAD_USERS,
    users,
  }
}

export function getUsers() {
  return (dispatch) => {
    apiCall("get", "/api/users")
      .then((res) => dispatch(loadUsers(res)))
      .catch((err) => dispatch(addError(err.message)))
  }
}
