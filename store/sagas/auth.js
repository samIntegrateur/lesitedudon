import {put, delay, call} from 'redux-saga/effects';
import * as actions from '../actions/';
import {API_AUTH_URL, API_KEY} from '../../shared/constants';

export function* logoutSaga(action) {
  // with call it's easier to test, we can mock it
  yield call([localStorage, 'removeItem'], 'token');
  yield call([localStorage, 'removeItem'], 'expirationDate');
  yield call([localStorage, 'removeItem'], 'userId');
  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  // todo: check if it works as expected, can't we have 2 delay if we connect multiple times
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());

  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };

  const url = action.isSignin ? `${API_AUTH_URL}accounts:signInWithPassword` : `${API_AUTH_URL}accounts:signUp`;

  try {
    const response = yield call(fetch, `${url}?key=${API_KEY}`, {
      method: 'POST',
      body: JSON.stringify(authData),
      headers: {'Content-Type': 'application/json'}
    });
    console.log('response', response);
    const responseBody = yield response.json();
    console.log('response', responseBody);
    if (responseBody.error) {
      yield put(actions.authFail(responseBody.error));
    } else {
      const expirationDate = yield new Date(new Date().getTime() + (parseInt(responseBody.expiresIn) * 1000));
      yield localStorage.setItem('token', responseBody.idToken);
      yield localStorage.setItem('expirationDate', expirationDate);
      yield localStorage.setItem('userId', responseBody.localId);
      yield put(actions.authSuccess(responseBody.idToken, responseBody.localId));
      yield put(actions.checkAuthTimeout(responseBody.expiresIn));
    }

  } catch(error) {
    console.log('error', error);
    yield put(actions.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  yield put(actions.authSetFirstCheck());
  const token = yield localStorage.getItem('token');
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield localStorage.getItem('userId');
      yield put(actions.authSuccess(token, userId));
      yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
    }
  }
}
