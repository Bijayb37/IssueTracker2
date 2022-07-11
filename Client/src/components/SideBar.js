import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/actions/authActions"
import { NavLink } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import { AnimatePresence, motion, useCycle } from "framer-motion"
import DialogTemplate from "../components/DialogTemplate"
import ProjectForm from "../components/ProjectForm"
import "../styles/sidebar.css"

function SideBar() {
  const { currentUser } = useSelector((state) => state)
  const { isAuthenticated } = currentUser
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { id: userId } = currentUser.user
  const dispatch = useDispatch()
  const [show, setShow] = useCycle(true, false)
  const [hover, setHover] = useState(false)
  const handleHover = () => setHover(true)
  const handleHover2 = () => setHover(false)
  const handleLogout = () => {
    dispatch(logout())
  }

  const sideVariants = {
    closed: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.2,
        staggerDirection: 1,
      },
    },
  }
  const itemVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  }

  const openButton = () =>
    hover ? (
      <i
        onMouseLeave={handleHover2}
        onClick={setShow}
        className={`bi bi-arrow-${show ? "left" : "right"}`}
      ></i>
    ) : (
      <i onMouseEnter={handleHover} className="bi bi-list"></i>
    )

  if (isAuthenticated && !isMobile) {
    return (
      <AnimatePresence exitBeforeEnter>
        {show === true ? (
          <motion.div
            className="sidebar"
            initial={{ width: 62 }}
            animate={{
              width: 300,
            }}
            exit={{
              width: 62,
              transition: { delay: 0.4, duration: 0.3, type: "linear" },
            }}
            key="sidebarkey"
          >
            <div className="stickySidebar">
              <div className="icon">{openButton()}</div>
              <div className="sidebarLogo">
                <img src="/issuesIcon.png" alt="issues icon"/>
                <h1>Issues Tracker</h1>
              </div>
              <motion.ul
                className="items"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideVariants}
              >
                <motion.li
                  className="list-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <i className="bi bi-card-list"></i>
                  <NavLink className="nav-link" to="/">
                    Projects
                  </NavLink>
                </motion.li>
                <motion.li
                  className="list-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <i className="bi bi-person-circle"></i>
                  <NavLink className="nav-link" to={`/${userId}/profile`}>
                    Issues
                  </NavLink>
                </motion.li>
                <motion.li
                  className="list-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <i className="bi bi-plus-circle"></i>
                  <DialogTemplate
                    title="Create Project"
                    dialogType="form"
                    trigger={{
                      type: "sidebar-text",
                      text: "Create Project",
                      icon: "bi-plus-circle",
                    }}
                  >
                    <ProjectForm editMode={null} />
                  </DialogTemplate>
                </motion.li>
                <motion.li
                  className="list-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <i className="bi bi-power"></i>
                  <button
                    onClick={handleLogout}
                    className="nav-link sidebar-button"
                  >
                    Logout
                  </button>
                </motion.li>
              </motion.ul>
            </div>
          </motion.div>
        ) : (
          <div className="sidebar collapsed">
            <div className="icon-collapsed">{openButton()}</div>
            <div className="items">
              <NavLink to="/">
                <i className="bi bi-card-list"></i>
              </NavLink>
              <NavLink to={`/${userId}/profile`}>
                <i className="bi bi-person-circle"></i>
              </NavLink>
              <div className="sidebar-button">
                <DialogTemplate
                  title="Create Project"
                  dialogType="form"
                  trigger={{
                    type: "sidebar-icon",
                    text: "Create Project",
                    icon: "bi-plus-circle",
                  }}
                >
                  <ProjectForm editMode={null} />
                </DialogTemplate>
              </div>
              <button onClick={handleLogout} className="sidebar-button">
                <i className="bi bi-power"></i>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    )
  }
  return null
}

export default SideBar
