import React, { Fragment } from "react"
import { formatDateTime } from "../utils/helperFunctions"
import IssueMenu from "./IssueMenu"
import { cellStyles, cellColors, spanStyles } from "../styles/customStyles"
import { Link } from "react-router-dom"
import "../styles/IssueListMobile.css"
import { useSelector } from "react-redux"

function IssueListMobile({ issues = [] }) {
  const { user } = useSelector((state) => state.currentUser)

  const mappedIssues = issues.map((issue, i) => {
    const isAdmin = user?.id === issue.createdBy._id
    const isMember =
      issue?.assignedUsers.map((user) => user._id).includes(user.id) || isAdmin
    return (
      <Fragment key={issue._id}>
        <ul className="list-unstyled">
          <li className="h5 link">
            <Link to={`/issues/${issue._id}`} className="link">
              {issue.title}&nbsp;
            </Link>
            <i className="bi bi-link-45deg"></i>
          </li>
          <li>
            <span style={{ ...spanStyles }}>Your Role:</span>
            <div
              style={{
                ...cellStyles,
              }}
            >
              {isMember ? (isAdmin ? "Admin" : "Member") : "None"}
            </div>
          </li>
          <li>
            <span style={{ ...spanStyles }}>Priority:</span>
            <div
              style={{
                ...cellStyles,
                backgroundColor: cellColors[issue.priority],
                color: issue.priority === "low" ? "#000" : "#fff",
              }}
            >
              {issue.priority}
            </div>
          </li>
          <li>
            <span style={{ ...spanStyles }}>Status:</span>
            <div
              style={{
                ...cellStyles,
                backgroundColor: cellColors[issue.status],
                color: issue.status === "closed" ? "#008000" : "#000080",
              }}
            >
              {issue.status}
            </div>
          </li>

          <li>
            <span style={{ ...spanStyles }}>Type:</span>
            <div
              style={{
                ...cellStyles,
                backgroundColor: cellColors[issue.type],
              }}
            >
              {issue.type}
            </div>
          </li>
          <li>
            <span style={{ ...spanStyles }}>Created:</span>
            <div
              style={{
                ...cellStyles,
              }}
            >
              {formatDateTime(issue.createdAt)}
            </div>
          </li>
          <li>
            <span style={{ ...spanStyles }}>Updated:</span>
            <div
              style={{
                ...cellStyles,
              }}
            >
              {formatDateTime(issue.updatedAt)}
            </div>
          </li>
          <li className="issueItemButtons">
            <div>
              <i className="bi bi-chat-square-text"></i>
              &nbsp;: {issue?.comments.length}
              &nbsp;&nbsp;<i className="bi bi-people"></i>
              &nbsp;: {issue?.assignedUsers.length + 1}
            </div>
            <IssueMenu issue={issue} />
          </li>
        </ul>
        {i + 1 !== issues.length && <hr />}
      </Fragment>
    )
  })
  return (
    <div className="issueListContainer">
      {issues.length ? (
        mappedIssues
      ) : (
        <p className="lead">No Issues Added Yet</p>
      )}
    </div>
  )
}

export default IssueListMobile
