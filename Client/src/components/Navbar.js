import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/actions/authActions'
import { NavLink } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useHistory } from "react-router-dom"
import '../styles/navbar.css'

function Navbar() {
  const { currentUser } = useSelector(state => state)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false);
  const history = useHistory()
  const { isAuthenticated } = currentUser
  const { username, id: userId } = currentUser.user

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const buttons = () => {
    if (isAuthenticated) {
      const handleLogout = () => {
        dispatch(logout())
      }
      return (
        isMobile
          ? <>
            <i onClick={handleShow} className="bi bi-list navbarIcon"></i>
            <Offcanvas placement='end' style={{ width: '50%' }} show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{username.charAt(0).toUpperCase() + username.slice(1)}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="navbarCanvas">
                <NavLink onClick={handleClose} className="nav-link text-truncate" to="/">Projects</NavLink>
                <NavLink onClick={handleClose} className="nav-link text-truncate" to={`/${userId}/profile`}>My Profile/Issues</NavLink>
                <button onClick={handleLogout} className="nav-link text-truncate nav-button">Logout</button>
              </Offcanvas.Body>
            </Offcanvas>
          </>
          : <>
            <i onClick={() => history.goBack()} className="bi bi-arrow-left"></i>
            <NavLink className="nav-link text-truncate" to="/">Projects</NavLink>
            <NavLink className="nav-link text-truncate" to={`/${userId}/profile`}>My Profile/Issues</NavLink>
            <button onClick={handleLogout} className="nav-link text-truncate nav-button">Logout</button>
          </>
      )
    } else {
      return (
        <>
          {/* <NavLink className="nav-link text-truncate" to="/login">Login</NavLink>
          <NavLink className="nav-link text-truncate" to="/Signup">Signup</NavLink> */}
        </>
      )
    }
  }
  return (
    <div className={isMobile ? "navbar-mobile" : "navbar"}>
      {buttons()}
    </div>
  )
}

export default Navbar