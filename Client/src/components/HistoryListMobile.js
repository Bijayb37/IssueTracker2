import React, { Fragment } from "react"
import { formatDateTime, formatFormDate } from "../utils/helperFunctions"
import { cellStyles, spanStyles } from "../styles/customStyles"
import "../styles/IssueListMobile.css"

function HistoryListMobile({ history = [] }) {
  const getValues = (value, property) => {
    switch (property) {
      case "targetEndDate":
        return formatFormDate(value)
      case "assignedUsers":
        return value.length
          ? value.map((val) => val.username + ", ")
          : "No Users"
      default:
        return value
    }
  }

  const mappedHistory = history.map((his, i) => {
    return (
      <Fragment key={his._id}>
        <ul className="list-unstyled">
          <li>
            <span style={{ ...spanStyles }}>Property:</span>
            <div
              style={{
                ...cellStyles,
              }}
            >
              {his.property}
            </div>
          </li>
          <li>
            <span style={{ ...spanStyles }}>Old Value:</span>
            <div
              style={{
                ...cellStyles,
              }}
            >
              {getValues(his.oldValue, his.property)}
            </div>
          </li>

          <li>
            <span style={{ ...spanStyles }}>New Value:</span>
            <div
              style={{
                ...cellStyles,
              }}
            >
              {getValues(his.newValue, his.property)}
            </div>
          </li>
          <li>
            <span style={{ ...spanStyles }}>Updated By:</span>
            <div
              style={{
                ...cellStyles,
              }}
            >
              {his.updatedBy?.username
                ? `${his.updatedBy.username} ~${formatDateTime(his.updatedAt)}`
                : "Undefined User"}
            </div>
          </li>
        </ul>
        {i + 1 !== history.length && <hr />}
      </Fragment>
    )
  })
  return (
    <div className="issueListContainer">
      {history.length !== 0 ? (
        mappedHistory
      ) : (
        <p className="lead">No edits have been made</p>
      )}
    </div>
  )
}

export default HistoryListMobile
