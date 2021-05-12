import { takeLatest, takeEvery, call, put } from "redux-saga/effects";

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* queryWatcherSaga() {
  yield takeEvery("API_CALL_REQUEST", queryWorkerSaga);
}

export function* sessionWatcherSaga() {
  yield takeLatest("API_LOAD_SESSION", sessionWorkerSaga);
}

function fetchAnswer(data) {
  return fetch(`/api/process`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(response => response.json())
}

// worker saga: makes the api call when watcher saga sees the action
function* queryWorkerSaga(action) {
  try {
    const response = yield call(fetchAnswer, action.payload);

    // dispatch a success action to the store with the new msg
    yield put({ type: "API_CALL_SUCCESS", payload: response });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: "API_CALL_FAILURE", error });
  }
}

function fetchSession() {
  return fetch(`/api/session`).then(response => response.json())
}

function* sessionWorkerSaga() {
  try {
    const response = yield call(fetchSession);

    yield put({ type: "API_LOAD_SESSION_SUCCESS", sessionId: response.msg });

  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: "API_LOAD_SESSION_FAILURE", error });
  }
}
