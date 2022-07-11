import React, { Fragment } from "react"
import { formatDateTime } from "../utils/helperFunctions"
import { cellStyles, spanStyles } from "../styles/customStyles"
import { Link } from "react-router-dom"
import { ProjectMenu } from "./ProjectMenu"
import "../styles/ProjectListMobile.css"

function ProjectListMobile({ projects = [] }) {
  const mappedProjects = projects.map((project, i) => (
    <Fragment key={project._id}>
      <ul className="list-unstyled">
        <li className="h5 link">
          <Link to={`/projects/${project._id}`} className="link">
            {project.projectName}&nbsp;
          </Link>
          <i className="bi bi-link-45deg"></i>
        </li>
        <li>
          <span style={{ ...spanStyles }}>Created By:</span>
          <div
            style={{
              ...cellStyles,
            }}
          >
            {project.createdBy.username}
          </div>
        </li>
        <li>
          <span style={{ ...spanStyles }}>Members:</span>
          <div
            style={{
              ...cellStyles,
            }}
          >
            {project.assignedUsers.length + 1}
          </div>
        </li>
        <li>
          <span style={{ ...spanStyles }}>Target Date:</span>
          <div
            style={{
              ...cellStyles,
            }}
          >
            {formatDateTime(project?.targetEndDate)}
          </div>
        </li>
        <li>
          <span style={{ ...spanStyles }}>Created At:</span>
          <div
            style={{
              ...cellStyles,
            }}
          >
            {formatDateTime(project.createdAt)}
          </div>
        </li>
        <li>
          <span style={{ ...spanStyles }}>Updated:</span>
          <div
            style={{
              ...cellStyles,
            }}
          >
            {formatDateTime(project.updatedAt)}
          </div>
        </li>
        <li className="projectItemButtons">
          <div>
            <i className="bi bi-people"></i>
            &nbsp;: {project?.assignedUsers.length}
          </div>
          <ProjectMenu project={project} />
        </li>
      </ul>
      {i + 1 !== projects.length && <hr />}
    </Fragment>
  ))
  return (
    <div className="projectListContainer">
      {projects.length !== 0 ? mappedProjects : "No Projects Added Yet"}
    </div>
  )
}

export default ProjectListMobile
