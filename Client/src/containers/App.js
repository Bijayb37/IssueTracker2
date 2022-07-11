import React, { useEffect } from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import AuthForm from "../components/AuthForm"
import ProjectPage from "../containers/ProjectPage"
import AllProjects from "../containers/AllProjects"
import MyProfile from "../containers/MyProfile"
import { useDispatch, useSelector } from "react-redux"
import { autoLogin } from "../store/actions/authActions"
import "../App.css"
import IssuePage from "../containers/IssuePage"

function App() {
  const { currentUser, projects, issues } = useSelector((state) => state)
  const isLoggedIn = localStorage.jwt || currentUser.isAuthenticated
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(autoLogin())
  }, [dispatch])

  const findProject = (projectId) => {
    return projects.find((project) => project._id === projectId)
  }

  const findIssue = (issueId) => {
    return issues.find((issue) => issue._id === issueId)
  }
  // <Redirect to='/login' />
  return (
    <div className="appContainer">
      <Switch>
        <Route
          exact
          path="/"
          render={(routeProps) =>
            isLoggedIn ? (
              <AllProjects currentUser={currentUser} {...routeProps} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          exact
          path="/login"
          render={(routeProps) =>
            !isLoggedIn ? <AuthForm {...routeProps} /> : <Redirect to="/" />
          }
        />
        <Route
          exact
          path="/signup"
          render={(routeProps) =>
            !isLoggedIn ? (
              <AuthForm signup {...routeProps} />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route
          exact
          path="/projects/:projectId"
          render={(routeProps) =>
            isLoggedIn ? (
              <ProjectPage
                project={findProject(routeProps.match.params.projectId)}
                user={currentUser.user}
                issues={issues}
                {...routeProps}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route
          exact
          path={`/:userId/profile`}
          render={(routeProps) =>
            isLoggedIn ? <MyProfile {...routeProps} /> : <Redirect to="/" />
          }
        />
        <Route
          exact
          path="/issues/:issueId"
          render={(routeProps) =>
            isLoggedIn ? (
              <IssuePage
                issues={issues}
                user={currentUser.user}
                issue={findIssue(routeProps.match.params.issueId)}
                {...routeProps}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />
      </Switch>
    </div>
  )
}

export default App
