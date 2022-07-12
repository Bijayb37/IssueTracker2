import React, { useMemo, useState, useCallback } from "react"
import TestTable from "../components/TestTable"
import {
  projectPageIssueColumns,
  issueChangesColumns,
} from "../data/columns"
import Card from "react-bootstrap/Card"
import DialogTemplate from "../components/DialogTemplate"
import IssueListMobile from "../components/IssueListMobile"
import HistoryListMobile from "../components/HistoryListMobile"
import { useMediaQuery } from "react-responsive"
import IssuesForm from "../components/IssuesForm"
import ProjectForm from "../components/ProjectForm"
import { useHistory, useParams } from "react-router"
import { useDispatch } from "react-redux"
import { deleteProject, leaveProject } from "../store/actions/projectActions"
import Form from "react-bootstrap/Form"
import "../styles/projectPage.css"
import {
  Capitalize,
  formatDateMonthDayYear,
  formatTimeAgo,
} from "../utils/helperFunctions"
import { Link } from "react-router-dom"

function ProjectPage(props) {
  const { project, issues, user } = props
  console.log(project)
  // console.log(issues)
  const { projectId } = useParams()
  const [filterValue, setFilterValue] = useState("all")
  const filterIssues = useCallback(
    (i) => {
      switch (filterValue) {
        case "open":
          return i.status === "open"
        case "closed":
          return i.status === "closed"
        default:
          return true
      }
    },
    [filterValue]
  )
  const history = useHistory()
  const issueData = useMemo(
    () =>
      issues
        ? issues.filter((i) => i.project === projectId && filterIssues(i))
        : [],
    [issues, projectId, filterIssues]
  )

  const issueColumns = useMemo(() => projectPageIssueColumns(), [])

  const changesColumns = useMemo(() => issueChangesColumns, [])
  const changesData = useMemo(() => (project ? project.history : []), [project])
  const isMobile = useMediaQuery({ maxWidth: 450 })
  const dispatch = useDispatch()
  const handleDeleteProject = () =>
    dispatch(deleteProject(project._id, history))
  const handleLeaveProject = () => dispatch(leaveProject(project._id, history))

  const issueDataToDisplay = () => {
    if (issueData) {
      return isMobile ? (
        <IssueListMobile issues={issueData} />
      ) : issueData.length ? (
        <div className="issuesTable">
          <TestTable columns={issueColumns} data={issueData} small />
        </div>
      ) : (
        <p className="lead">No Issues Added Yet</p>
      )
    }
  }

  const filterRadioButtons = (
    <Form
      className="filterButtons"
      onChange={(e) => setFilterValue(e.target.id)}
    >
      <div key="inline-radio">
        <p>Filter Issues By</p>
        <Form.Check
          inline
          defaultChecked
          label="All"
          name="group1"
          type="radio"
          id="all"
        />
        <Form.Check
          inline
          label="Closed"
          name="group1"
          type="radio"
          id="closed"
        />
        <Form.Check inline label="Open" name="group1" type="radio" id="open" />
      </div>
    </Form>
  )

  const adminButtons = () =>
    project?.createdBy._id === user?.id ? (
      <>
        <DialogTemplate
          title="Edit Project"
          dialogType="form"
          trigger={{
            type: "icon-box",
            text: "Edit Project",
            icon: "bi-pencil-square",
          }}
        >
          <ProjectForm edit project={project} />
        </DialogTemplate>
        <DialogTemplate
          title="Delete Project"
          contentText="Are you sure you want to delete this project"
          actionBtnText="Remove Project"
          actionFunc={handleDeleteProject}
          trigger={{
            type: "icon-box",
            text: "Delete Project",
            icon: "bi-trash",
          }}
        />
      </>
    ) : (
      <DialogTemplate
        title="Leave Project"
        contentText="Are you sure you want to leave this project"
        actionBtnText="Leave Project"
        actionFunc={handleLeaveProject}
        trigger={{
          type: "icon-box",
          text: "Leave Project",
          icon: "bi-pencil-square",
        }}
      />
    )

  const usersDetails = project?.assignedUsers.map(
    (user) => `${Capitalize(user.username)}, `
  )
  const projectDetails = () => {
    return (
      <div className="">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item bread-first" aria-current="page">
              <Link className="bread-first" to="/">
                <i className="bi bi-chevron-left me-2"></i>
                Projects
              </Link>
            </li>
            <li className="breadcrumb-item bread-last" aria-current="page">
              Project
            </li>
          </ol>
        </nav>
        <div className="pageTitle">
          <h1 data-testid="project-header" className="display-6">{project.projectName}</h1>
          <div className="icon-boxes">{adminButtons()}</div>
        </div>
        <div className="list-details">
          <div className="list-text">
            <span>Created By</span>
            <p>
              {Capitalize(project?.createdBy.username)},{" "}
              {formatDateMonthDayYear(project?.createdAt)}
            </p>
          </div>
          <div className="list-text">
            <span>Updated</span>
            <p>{formatTimeAgo(project?.updatedAt)} ago</p>
          </div>
          <div className="list-text">
            <span>Members</span>
            <p>{usersDetails.length > 0 ? usersDetails : "No Members"}</p>
          </div>
          <div className="list-text">
            <span>Target Date</span>
            <p>{formatDateMonthDayYear(project?.createdAt)}</p>
          </div>
        </div>
      </div>
    )
  }
  if (project) {
    return (
      <div className="pageWithTableContainer">
        <div className="projectPageTables">
          <Card className="projectIssuesCard non-table">
            <Card.Body className="cardBody">
              {projectDetails()}
            </Card.Body>
          </Card>
          <Card className="projectIssuesCard">
            <Card.Body className="cardBody">
              <div className="cardHeader">
                <h2 className="tableHeaders">Issues</h2>
                {filterRadioButtons}
                <DialogTemplate
                  title="Create Issue"
                  actionBtnText="Create Issue"
                  dialogType="form"
                  trigger={{
                    type: "menu",
                    text: "Create Issue",
                    icon: "bi-pencil-square",
                  }}
                >
                  <IssuesForm projectId={projectId} />
                </DialogTemplate>
              </div>
              {issueDataToDisplay()}
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
                <div className="issuesTable">
                  <TestTable
                    columns={changesColumns}
                    data={changesData}
                    numColumns={10}
                    small
                  />
                </div>
              ) : (
                <p className="lead">No edits have been made</p>
              )}
            </Card.Body>
          </Card>
          <br />
        </div>
      </div>
    )
  }
  return (
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default ProjectPage
