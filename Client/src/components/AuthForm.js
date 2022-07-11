import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authUser } from "../store/actions/authActions"
import { removeError } from "../store/actions/errorActions"
import { AnimatePresence, motion } from "framer-motion"
import "../styles/authForm.css"
import { Link } from "react-router-dom"

export default function AuthForm(props) {
  const { signup, history } = props
  const { errors } = useSelector((state) => state)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({
    username: "",
    password: "",
    email: "",
  })

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault()
    const authType = signup ? "signup" : "login"
    dispatch(authUser(authType, state, setLoading))
  }

  const loginGuest = (e) => {
    setLoading(true)
    e.preventDefault()
    dispatch(
      authUser("login", { username: "guest", password: "guest" }, setLoading)
    )
  }

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  history.listen(() => {
    dispatch(removeError())
  })
  useEffect(() => {
    return () => {}
  }, [])
  
  return (
    <div className="authFormContainer">
      <div className="formBox">
        <div className="d-flex flex-column signupBox">
          <AnimatePresence>
            <motion.form className="authForm" key={32}>
              {signup ? (
                <motion.div
                  className="loginInputs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={1}
                >
                  <div className="logo">
                    <img src="/issuesIcon.png" alt="Issues Icon" />
                    <h1>Issues Tracker</h1>
                  </div>
                  <span className="inputTitle">Sign Up</span>
                  <p className="inputAside">Enter your Details below</p>
                  <div className="labelAndInput">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      onChange={handleChange}
                      type="text"
                      className="form-control form-input"
                      name="email"
                      id="email"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="labelAndInput">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      onChange={handleChange}
                      type="text"
                      className="form-control form-input"
                      name="username"
                      placeholder="Username"
                      id="username"
                    />
                  </div>
                  <div className="labelAndInput">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      onChange={handleChange}
                      type="password"
                      className="form-control form-input"
                      name="password"
                      placeholder="Password"
                      id="password"
                    />
                  </div>
                  <div className="loginButtons">
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Sign Up
                    </button>
                  </div>
                  <span className="signupPrompt loginPrompt">
                    Already have an account <Link to="/login">Log In?</Link>
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  className="loginInputs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={2}
                >
                  <div className="logo">
                    <img src="/issuesIcon.png" alt="Issues Icon" />
                    <h1>Issues Tracker</h1>
                  </div>
                  <span className="inputTitle">Log In To Issues</span>
                  <p className="inputAside">
                    Enter your Email and Password below
                  </p>
                  <div className="labelAndInput">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      onChange={handleChange}
                      type="text"
                      className="form-control form-input"
                      name="username"
                      placeholder="Username/Email Address"
                      id="email"
                    />
                  </div>
                  <div className="labelAndInput">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      onChange={handleChange}
                      type="password"
                      className="form-control form-input"
                      name="password"
                      placeholder="Password"
                      id="password"
                    />
                  </div>
                  <div className="loginButtons">
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Log In
                    </button>
                    <span onClick={loginGuest}>Login As Guest</span>
                  </div>
                  <span className="signupPrompt">
                    Don't have an account <Link to="/signup">Sign Up?</Link>
                  </span>
                </motion.div>
              )}
            </motion.form>
            {loading && (
              <>
                <div className="spinner-border mt-3" role="status"></div>
                <span>Loading...</span>
              </>
            )}
            {errors?.message && (
              <div className="alert alert-danger mt-3" role="alert">
                {errors?.message}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
