import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";

import { reducer } from "./redux";
import { queryWatcherSaga, sessionWatcherSaga } from "./sagas";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// dev tools middleware
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

// create a redux store with our reducer above and middleware
let store
if (reduxDevTools) {
  store = createStore(reducer, compose(applyMiddleware(sagaMiddleware), reduxDevTools));
} else {
  store = createStore(reducer, compose(applyMiddleware(sagaMiddleware)));
}

// run the saga
sagaMiddleware.run(queryWatcherSaga);
sagaMiddleware.run(sessionWatcherSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
