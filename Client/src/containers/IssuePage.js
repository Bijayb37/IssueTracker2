import React, { useMemo } from "react"
import Card from "react-bootstrap/Card"
import { useDispatch } from "react-redux"
import DialogTemplate from "../components/DialogTemplate"
import {
  Capitalize,
  formatDateMonthDayYear,
  formatTimeAgo,
} from "../utils/helperFunctions"
import {
  deleteIssue,
  updateIssueStatus,
  deleteComment,
  leaveIssue,
} from "../store/actions/issueActions"
import CommentsForm from "../components/CommentsForm"
import IssuesForm from "../components/IssuesForm"
import HistoryListMobile from "../components/HistoryListMobile"
import { spanStyles } from "../styles/customStyles"
import TestTable from "../components/TestTable"
import { issueChangesColumns } from "../data/columns"
import { useMediaQuery } from "react-responsive"
import "../styles/issuePage.css"
import { Link } from "react-router-dom"

function IssuePage({ issue, user }) {
  const dispatch = useDispatch()
  const changesColumns = useMemo(() => issueChangesColumns, [])
  const changesData = useMemo(() => (issue ? issue.history : []), [issue])
  const isMobile = useMediaQuery({ maxWidth: 450 })
  const isAdmin = user.id === issue?.createdBy._id
  const isMember =
    issue?.assignedUsers.map((user) => user._id).includes(user.id) || isAdmin
  const handleDeleteIssue = () => dispatch(deleteIssue(issue._id))
  const handleLeaveIssue = () => dispatch(leaveIssue(issue._id))
  const handleDeleteComment = (commentId) =>
    dispatch(deleteComment(commentId, issue._id))
  const handleIssueStatus = () => {
    const type = issue.status === "open" ? "closed" : "open"
    dispatch(updateIssueStatus(issue._id, type))
  }

  const mappedComments = issue?.comments.map((comment, i) => (
    <div key={comment._id} className="mappedIssuesContainer">
      <ul className="list-unstyled">
        <li className="title">
          <span style={spanStyles}>
            {comment.createdBy.username} :
            <em> Created {formatTimeAgo(comment.createdAt)} ago</em>
            {comment.createdAt !== comment.updatedAt && (
              <em> ~ updated {formatTimeAgo(comment.updatedAt)} ago</em>
            )}
          </span>
        </li>
        <li>
          <span style={{ spanStyles }}>{comment.text}</span>
        </li>
        <li className="issueButtons">
          <DialogTemplate
            title="Edit Comment"
            dialogType="form"
            trigger={{
              type: "normal",
              variant: "secondary",
              size: "sm",
              text: "Edit",
              icon: "bi-pencil-square",
            }}
          >
            <CommentsForm issueId={issue._id} comment={comment} edit />
          </DialogTemplate>
          <DialogTemplate
            title="Remove"
            contentText="Are you sure you want to remove issue"
            actionBtnText="Remove"
            actionFunc={() => handleDeleteComment(comment._id)}
            trigger={{
              type: "normal",
              variant: "secondary",
              size: "sm",
              text: "Remove",
              icon: "bi-trash",
            }}
          />
        </li>
      </ul>
      {issue.comments.length !== i + 1 && <hr className="comments-divider" />}
    </div>
  ))

  const issueButtons = () =>
    //close issue, update, and delete
    issue?.createdBy._id === user.id ? (
      <>
        {issue.status === "open" ? (
          <DialogTemplate
            title="Close"
            contentText="Are you sure you want to close issue"
            actionBtnText="Close Issue"
            actionFunc={handleIssueStatus}
            trigger={{
              type: "icon-box",
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
              type: "icon-box",
              text: "Re-open Issue",
              icon: "bi-arrow-return-right",
            }}
          />
        )}
        <DialogTemplate
          title="Edit Issue"
          actionBtnText="Edit Issue"
          dialogType="form"
          trigger={{
            type: "icon-box",
            text: "Edit Issue",
            icon: "bi-pencil-square",
          }}
        >
          <IssuesForm issue={issue} edit />
        </DialogTemplate>
        <DialogTemplate
          title="Remove"
          contentText="Are you sure you want to remove issue"
          actionBtnText="Remove"
          actionFunc={handleDeleteIssue}
          trigger={{
            type: "icon-box",
            text: "Remove Issue",
            icon: "bi-trash",
          }}
        />
      </>
    ) : (
      isMember && (
        <DialogTemplate
          title="Leave Issue"
          contentText="Are you sure you want to leave this Issue"
          actionBtnText="Leave Issue"
          actionFunc={handleLeaveIssue}
          trigger={{
            type: "icon-box",
            text: "Leave Issue",
            icon: "bi-pencil-square",
          }}
        />
      )
    )

  const usersDetails = issue?.assignedUsers.map(
    (user) => `${Capitalize(user.username)}, `
  )

  const IssueDetails = () => {
    return (
      <div className="">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item bread-first" aria-current="page">
              <Link className="bread-first" to={`/projects/${issue.project}`}>
                <i className="bi bi-chevron-left me-2"></i>
                Project
              </Link>
            </li>
            <li className="breadcrumb-item bread-last" aria-current="page">
              Issue
            </li>
          </ol>
        </nav>
        <div className="pageTitle">
          <h1 className="display-6">{issue.title}</h1>
          <div className="icon-boxes">{issueButtons()}</div>
        </div>
        <div className="list-details">
          <div className="list-text">
            <span>Created By</span>
            <p>
              {Capitalize(issue?.createdBy.username)},{" "}
              {formatDateMonthDayYear(issue?.createdAt)}
            </p>
          </div>
          <div className="list-text">
            <span>Updated</span>
            <p>{formatTimeAgo(issue?.updatedAt)} ago</p>
          </div>
          <div className="list-text">
            <span>Members</span>
            <p>{usersDetails.length > 0 ? usersDetails : "No Members"}</p>
          </div>
          <div className="list-text">
            <span>Target Date</span>
            <p>{formatDateMonthDayYear(issue?.targetEndDate)}</p>
          </div>
          <div className="list-text">
            <span>Priority</span>
            <p>{Capitalize(issue?.priority)}</p>
          </div>
          <div className="list-text">
            <span>Status</span>
            <p className={`contrast-box ${issue?.status}-card`}>
              {Capitalize(issue?.status)}
            </p>
          </div>
          <div className="list-text">
            <span>Type</span>
            <p
              className={`contrast-box ${
                issue.type === "feature" ? "feature" : "bugs"
              }-card`}
            >
              {Capitalize(issue.type)}
            </p>
          </div>
        </div>
      </div>
    )
  }
  if (issue) {
    return (
      <div className="pageWithTableContainer">
        <Card className="projectIssuesCard px-md-3 py-md-3 py-1">
          <Card.Body>{IssueDetails()}</Card.Body>
        </Card>
        <Card className="projectIssuesCard">
          <Card.Body className="cardBody">
            <div className="cardHeader">
              <h2>Comments</h2>
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
            </div>
            {issue?.comments.length !== 0 ? (
              mappedComments
            ) : (
              <p className="lead">No comments have been made</p>
            )}
          </Card.Body>
        </Card>
        <Card className="projectIssuesCard">
          <Card.Body className="cardBody">
            <div className="cardHeader">
              <h2>History</h2>
            </div>
            {isMobile ? (
              <HistoryListMobile history={changesData} />
            ) : changesData.length ? (
              <TestTable
                columns={changesColumns}
                data={changesData}
                numColumns={10}
                small
              />
            ) : (
              <p className="lead">No edits have been made</p>
            )}
          </Card.Body>
        </Card>
      </div>
    )
  }
  return (
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default IssuePage
