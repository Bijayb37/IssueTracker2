import { applyMiddleware, createStore, compose } from "redux"
import thunk from "redux-thunk"
import reduxPromise from "redux-promise"
import rootReducer from "./reducers"

export default function configureStore() {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk, reduxPromise))
  )
  return store
}
