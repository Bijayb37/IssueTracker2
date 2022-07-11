import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Select from "react-select"
import { patchIssue, postIssue } from "../store/actions/issueActions"
import { differences } from "../utils/historyFunctions"
import { formatFormDate } from "../utils/helperFunctions"

function IssuesForm({ issue, edit, closeModal, projectId }) {
  const initialState = {
    title: issue?.title || undefined,
    description: issue?.description || undefined,
    targetEndDate: issue?.targetEndDate || undefined,
    assignedUsers: undefined,
    priority: issue?.priority || "low",
    status: issue?.status || "open",
    type: issue?.type || "bugs/error",
  }

  const [state, setState] = useState(initialState)
  const { users, errors, currentUser } = useSelector((state) => state)
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (edit) {
      const issueDifferences = differences(issue, state, users)
      dispatch(patchIssue(issue?._id, state, issueDifferences, closeModal))
    } else dispatch(postIssue(state, projectId, closeModal))
  }
  //mapping onto a react-select array of objects
  const userOptions = edit
    ? users
        .filter((user) => user._id !== issue.createdBy._id)
        .map((user, i) => ({ label: user.username, value: user._id }))
    : users
        .filter((user) => user._id !== currentUser.user.id)
        .map((user, i) => ({ label: user.username, value: user._id }))

  //filter users for default values of multi select
  const filterUsers = userOptions.filter((user) =>
    issue?.assignedUsers.map((user) => user._id).includes(user.value)
  )

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleMultipleSelect = (e) => {
    const newState = e.map((val) => val.value)
    setState((prev) => ({ ...prev, assignedUsers: newState }))
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="loginInputs">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              value={state.title ? state.title : ""}
              onChange={handleChange}
              type="text"
              className="form-control"
              name="title"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              value={state.description ? state.description : ""}
              onChange={handleChange}
              type="text"
              className="form-control"
              name="description"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="targetEndDate" className="form-label">
              Target End Date
            </label>
            <input
              value={
                state.targetEndDate ? formatFormDate(state.targetEndDate) : ""
              }
              onChange={handleChange}
              type="date"
              className="form-control"
              name="targetEndDate"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="assignedUsers" className="form-label">
              Assigned User
            </label>
            <Select
              isMulti
              defaultValue={filterUsers}
              name="colors"
              options={userOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleMultipleSelect}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              value={state.priority ? state.priority : "low"}
              name="priority"
              onChange={handleChange}
              className="form-select"
              aria-label="Default select example"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              value={state.status ? state.status : "open"}
              name="status"
              onChange={handleChange}
              className="form-select"
              aria-label="Default select example"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <select
              value={state.type ? state.type : "bugs/error"}
              name="type"
              onChange={handleChange}
              className="form-select"
              aria-label="Default select example"
            >
              <option value="bugs/error">Bugs/Error</option>
              <option value="feature">Feature</option>
            </select>
          </div>
        </div>
      </form>
      {errors.message && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i
            className="bi bi-exclamation-triangle-fill"
            style={{ fontSize: "20px", paddingRight: "10px" }}
          ></i>
          <div>{errors.message}</div>
        </div>
      )}
      <button
        onClick={handleSubmit}
        name="create"
        type="button"
        className="btn btn-primary"
      >
        {edit ? "Edit Issue" : "Create Issue"}
      </button>
    </div>
  )
}

export default IssuesForm
