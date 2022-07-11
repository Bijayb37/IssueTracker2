import React from "react"
import Dropdown from "react-bootstrap/Dropdown"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { deleteIssue, updateIssueStatus } from "../store/actions/issueActions"
import DialogTemplate from "./DialogTemplate"
import IssuesForm from "./IssuesForm"
import CommentsForm from "./CommentsForm"
import "../styles/menu.css"

function IssueMenu({ issue }) {
  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <i
      className="bi bi-three-dots-vertical"
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
    ></i>
  ))
  const { user } = useSelector((state) => state.currentUser)
  const currentUserInIssue =
    issue.assignedUsers.map((user) => user._id).includes(user.id) ||
    issue.createdBy._id === user.id
  const dispatch = useDispatch()
  const handleDeleteIssue = () => dispatch(deleteIssue(issue._id))
  const handleIssueStatus = () => {
    const type = issue.status === "open" ? "closed" : "open"
    dispatch(updateIssueStatus(issue._id, type))
  }

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle
          as={CustomToggle}
          id="dropdown-basic-button"
          title="Dropdown button"
          data-testid="test-dropdown"
        />
        <Dropdown.Menu className="dropdownMenu">
          <Dropdown.Item
            className="dropdownItem"
            as={Link}
            to={`/issues/${issue._id}`}
            href="#/action-2"
          >
            <i style={{ marginRight: "10px" }} className="bi bi-link-45deg"></i>
            View Issue
          </Dropdown.Item>
          {currentUserInIssue &&
            (issue.status === "open" ? (
              <DialogTemplate
                title="Close"
                contentText="Are you sure you want to close issue"
                actionBtnText="Close Issue"
                actionFunc={handleIssueStatus}
                trigger={{
                  type: "menu",
                  text: "Close Issue",
                  icon: "bi-check2",
                }}
              />
            ) : (
              <DialogTemplate
                title="Re-open"
                contentText="Are you sure you want to re-open issue"
                actionBtnText="Re-open Issue"
                actionFunc={handleIssueStatus}
                trigger={{
                  type: "menu",
                  text: "Re-open Issue",
                  icon: "bi-arrow-return-right",
                }}
              />
            ))}
          {currentUserInIssue && (
            <DialogTemplate
              title="Edit Issue"
              actionBtnText="Edit Issue"
              dialogType="form"
              trigger={{
                type: "menu",
                text: "Edit Issue",
                icon: "bi-pencil-square",
              }}
            >
              <IssuesForm issue={issue} edit />
            </DialogTemplate>
          )}
          <DialogTemplate
            title="Add Comment"
            dialogType="form"
            trigger={{
              type: "menu",
              text: "Add Comment",
              icon: "bi-card-text",
            }}
          >
            <CommentsForm issueId={issue._id} />
          </DialogTemplate>
          {currentUserInIssue && (
            <DialogTemplate
              title="Remove"
              contentText="Are you sure you want to remove issue"
              actionBtnText="Remove"
              actionFunc={handleDeleteIssue}
              trigger={{
                type: "menu",
                text: "Remove Issue",
                icon: "bi-trash",
              }}
            />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default IssueMenu
