import App from "../containers/App"
import { screen, waitForElementToBeRemoved } from "@testing-library/react"
import configureStore from "../store"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { render, userEvent } from "../test/test-utils"

const server = setupServer(
  rest.post(
    "https://issue-tracker-psi.vercel.app/api/auth/login",
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          token: "123",
          email: "test@example.com",
          id: "1",
          username: "beej",
        })
      )
    }
  )
)
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

const store = configureStore()

test("switching to signup", async () => {
  render(<App />, {}, store)
  const signupButton = screen.getByRole("link", { name: /sign up?/i })
  expect(signupButton).toBeInTheDocument()
  await userEvent.click(signupButton)
  expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
})

test("switching back to login", async () => {
  render(<App />, {}, store)
  const loginButton = screen.getByRole("link", { name: /log in?/i })
  expect(loginButton).toBeInTheDocument()
  await userEvent.click(loginButton)
  expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
})

test("check that inputs work", async () => {
  render(<App />, {}, store)
  const usernameTextBox = screen.getByPlaceholderText(
    /Username\/Email Address/i
  )
  const testText = "Hello World"
  await userEvent.type(usernameTextBox, testText)
  expect(usernameTextBox.value).toBe(testText)
})

test("logging in as guest", async () => {
  render(<App />, {}, store)
  const loginAsGuest = screen.getByText(/login as guest/i)
  expect(loginAsGuest).toBeInTheDocument()
  await userEvent.click(loginAsGuest)
  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByText(/log in to issues/i),
  ])
  expect(
    screen.getByRole("heading", { name: "All Projects" })
  ).toBeInTheDocument()
  const ne = screen.getByRole("link", { name: /issues/i })
  await userEvent.click(ne)
  screen.debug()
})
