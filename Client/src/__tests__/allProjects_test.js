import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import reduxPromise from "redux-promise"
import AllProjects from "../containers/AllProjects"
import { allProjectsReducer } from "../test/reducer-exports"
import {
  render,
  userEvent,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from "../test/test-utils"
import { rest } from "msw"
import { setupServer } from "msw/node"

const projectError = {
  message: "project name and description cannot be empty",
  status: 400,
}

const server = setupServer(
  rest.post(
    "https://issue-tracker-psi.vercel.app/api/users/1/projects",
    async (req, res, ctx) => {
      const { projectName } = req.body
      if (!projectName) {
        return res(
          ctx.status(400),
          ctx.json({
            error: projectError,
          })
        )
      }
      return res(
        ctx.status(200),
        ctx.json({
          projectName: "big project",
          description: "mello",
          assignedUsers: [],
          createdAt: "2022-01-13T02:47:02.799Z",
          createdBy: {
            _id: "618f20bed071a20016107894",
            username: "guest",
            email: "guest@gmail.com",
          },
          history: [],
          issues: [],
          targetEndDate: "2022-01-20T00:00:00.000Z",
          updatedAt: "2022-06-20T05:15:30.470Z",
        })
      )
    }
  )
)

// return next({ status: 400, message: errorMessageArray.join(" & ") })
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

const store = createStore(
  allProjectsReducer,
  applyMiddleware(thunk, reduxPromise)
)

test("see if error works", async () => {
  render(<AllProjects />, {}, store)
  expect(
    screen.getByRole("heading", { name: /all projects/i })
  ).toBeInTheDocument()

  const createButton = screen.getByTestId(/create-project-button/i)
  await userEvent.click(createButton)

  const formExists = screen.getByRole("button", { name: /create project/i })
  await waitFor(() => expect(formExists).toBeInTheDocument())

  const createProjectButton = screen.getByRole("button", {
    name: /create project/i,
  })
  await userEvent.click(createProjectButton)
  await waitFor(() => {
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })
  expect(screen.getByRole("alert")).toHaveTextContent(projectError.message)
})

test("creating a project works", async () => {
  render(<AllProjects />, {}, store)
  expect(
    screen.getByRole("heading", { name: /all projects/i })
  ).toBeInTheDocument()

  const createButton = screen.getByTestId(/create-project-button/i)
  await userEvent.click(createButton)

  const formExists = screen.getByRole("button", { name: /create project/i })
  await waitFor(() => expect(formExists).toBeInTheDocument())

  const projectName = screen.getByLabelText("projectName")
  const description = screen.getByLabelText("description")
  await userEvent.type(projectName, "Test Project")
  expect(projectName).toHaveValue("Test Project")
  await userEvent.type(description, "first project")
  expect(description).toHaveValue("first project")
  const createProjectButton = screen.getByRole("button", {
    name: /create project/i,
  })
  await userEvent.click(createProjectButton)
  await waitForElementToBeRemoved(() => screen.queryByTestId("test-modal"))
  expect(screen.getByRole("link", { name: /big project/i })).toBeInTheDocument()
})
