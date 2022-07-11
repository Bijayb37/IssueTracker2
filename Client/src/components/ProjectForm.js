import React, { useState } from 'react'
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux'
import { formatFormDate } from '../utils/helperFunctions'
import { differences } from '../utils/historyFunctions'
import { postProject, patchProject } from '../store/actions/projectActions'

function ProjectForm({
  project,
  edit,
  closeModal,
}) {
  const initialState = {
    projectName: project?.projectName || undefined,
    description: project?.description || undefined,
    targetEndDate: project?.targetEndDate || undefined,
    assignedUsers: undefined,
  }
  const [state, setState] = useState(initialState)
  const { users, errors, currentUser } = useSelector(state => state)
  const dispatch = useDispatch()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (edit) {
      const projectDifferences = differences(project, state, users)
      dispatch(patchProject(project._id, state, projectDifferences, closeModal))
    } else dispatch(postProject(state, closeModal))
  }

  //mapping onto a react-select array of objects
  const userOptions = edit
    ? users.filter(user => user._id !== project.createdBy._id).map((user, i) => (
      { label: user.username, value: user._id }
    ))
    : users?.filter(user => user._id !== currentUser.user.id).map((user, i) => (
      { label: user.username, value: user._id }
    ))

  //filter users for default values of multi select
  const filteredUsers = edit
    // ? userOptions.filter(user => project?.assignedUsers._id.includes(user.value))
    ? userOptions.filter(user => project?.assignedUsers.map(user => user._id).includes(user.value))
    : []

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleMultipleSelect = e => {
    const newState = e.map(val => val.value)
    setState(prev => ({ ...prev, assignedUsers: newState }))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <>
          <div className="mb-3" >
            <label htmlFor="projectName" className="form-label">Project Name</label>
            <input value={state.projectName ? state.projectName : ""} onChange={handleChange} type="text" className="form-control" name="projectName" aria-label="projectName"/>
          </div>
          <div className="mb-3" >
            <label htmlFor="description" className="form-label">Description</label>
            <input value={state.description ? state.description : ""} onChange={handleChange} type="text" className="form-control" name="description" aria-label="description"/>
          </div>
          <div className="mb-3" >
            <label htmlFor="targetEndDate" className="form-label">Target End Date</label>
            <input value={state.targetEndDate ? formatFormDate(state.targetEndDate) : ""} onChange={handleChange} type="date" className="form-control" name="targetEndDate" />
          </div>
        </>
        <div className="mb-3" >
          <label htmlFor="assignedUsers" className="form-label">User</label>
          <Select
            isMulti
            defaultValue={filteredUsers}
            name="colors"
            options={userOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleMultipleSelect}
          />
        </div>
      </form>
      {errors?.message &&
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "20px", paddingRight: "10px" }}></i>
          <div>
            {errors.message}
          </div>
        </div>
      }
      <button onClick={handleSubmit} name="create" type="button" className="btn btn-primary">
        {edit ? "Edit Project" : "Create Project"}
      </button>
    </div >
  )

}

export default ProjectForm