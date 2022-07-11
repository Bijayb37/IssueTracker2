import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import Navbar from "../components/Navbar"
import SideBar from "../components/SideBar"

const render = (ui, { options } = {}, store) => {
  const Wrapper = ({ children }) => {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="main-container">
            <SideBar />
            <div className="componentContainer">
              <Navbar />
              {children}
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper})
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ],
    {timeout: 4000},
  )

export * from '@testing-library/react'
export {render, userEvent , waitForLoadingToFinish}
