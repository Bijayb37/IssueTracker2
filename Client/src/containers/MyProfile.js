import React, { useState, useMemo, useCallback } from "react"
import { useSelector } from "react-redux"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import IssueListMobile from "../components/IssueListMobile"
import { projectPageIssueColumns } from "../data/columns"
import { useMediaQuery } from "react-responsive"
import "../styles/myProfile.css"
import TestTable from "../components/TestTable"

function MyProfile() {
  const issueColumns = useMemo(() => projectPageIssueColumns(), [])
  const isMobile = useMediaQuery({ maxWidth: 450 })
  const { currentUser, issues } = useSelector((state) => state)
  const { username, email, id } = currentUser.user
  const [filterValue, setFilterValue] = useState("all")

  const authMyIssues = useCallback(
    (issue) =>
      issue.createdBy._id === id ||
      issue.assignedUsers.map((user) => user._id).includes(id),
    [id]
  )
  const allIssues = useMemo(
    () =>
      issues
        ? {
            openIssues: issues.filter(
              (issue) => issue.status === "open" && authMyIssues(issue)
            ),
            closedIssues: issues.filter(
              (issue) => issue.status === "closed" && authMyIssues(issue)
            ),
            all: issues,
          }
        : [],
    [issues, authMyIssues]
  )

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
          id="closedIssues"
        />
        <Form.Check
          inline
          label="Open"
          name="group1"
          type="radio"
          id="openIssues"
        />
      </div>
    </Form>
  )

  const issueDataToDisplay = () => {
    if (allIssues) {
      return isMobile ? (
        <IssueListMobile issues={allIssues[filterValue]} />
      ) : allIssues[filterValue].length ? (
        <div className="issuesTable">
          <TestTable columns={issueColumns} data={allIssues[filterValue]} />
        </div>
      ) : (
        <p className="lead">No Issues Added Yet</p>
      )
    }
  }
  return (
    <div className="pageWithTableContainer">
      <div className="pageTitle">
        <h1>{username}'s Profile</h1>
        <h1>{email}</h1>
      </div>
      <Card className="projectIssuesCard">
        <Card.Body className="cardBody">
          <div className="cardHeader">
            <h2>My Issues</h2>
            {filterRadioButtons}
          </div>
          {issueDataToDisplay()}
        </Card.Body>
      </Card>
    </div>
  )
}

export default MyProfile
