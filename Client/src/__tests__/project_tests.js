import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import reduxPromise from "redux-promise"
import ProjectPage from "../containers/ProjectPage"
import { allProjectsReducer } from "../test/reducer-exports"
import {
  render,
  userEvent,
  waitFor,
  screen,
  waitForElementToBeRemoved,
  logRoles,
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
          _id: "2",
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
const project = {
  _id: "2",
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
}

// return next({ status: 400, message: errorMessageArray.join(" & ") })
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

const store = createStore(
  allProjectsReducer,
  applyMiddleware(thunk, reduxPromise)
)

test("Main elements and project render in", async () => {
  const { container } = render(<ProjectPage project={project}/>, {}, store)
  expect(
    screen.getByRole("heading", { name: /project/i })
  ).toBeInTheDocument()
  expect(
    screen.getByRole("heading", { name: project.projectName })
  ).toBeInTheDocument()
  expect(
    screen.getByRole("heading", { name: "Issues", exact: true })
  ).toBeInTheDocument()
  expect(
    screen.getByRole("heading", { name: "History", exact: true })
  ).toBeInTheDocument()
  // expect(
  //   screen.getByText(project.createdBy.username).toBeInTheDocument()
  // ).toBeInTheDocument()
  // const ne = screen.getByRole("link", { name: /issues/i })
  // await userEvent.click(ne)
  // screen.debug()
})
