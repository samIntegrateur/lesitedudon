import * as actions from '../actions';
import {put, call} from 'redux-saga/effects';
import {API_BASE_URL} from '../../shared/contants';
import {sanitizeOffers} from '../../shared/utility';

// Todo: handle response, it doesn't always mean a success
export function* fetchOffersSaga(action) {
  yield put(actions.fetchOffersStart());

  try {
    // todo: we can't sort desc, so we must take what we want (eventually with limitToLast) then sort in front
    const response = yield call(fetch, `${API_BASE_URL}offers.json?orderBy="creationDate"`);
    const responseBody = yield response.json();
    const sanitizedData = yield sanitizeOffers(responseBody);
    yield put(actions.fetchOffersSuccess(sanitizedData));
  } catch (error) {
    yield put(actions.fetchOffersFail(error));
  }
}

export function* fetchOfferSaga(action) {
  yield put(actions.fetchOfferStart());

  try {
    const response = yield call(fetch, `${API_BASE_URL}offers/${action.id}.json`);
    const responseBody = yield response.json();
    yield put(actions.fetchOfferSuccess(responseBody));
  } catch (error) {
    yield put(actions.fetchOfferFail(error));
  }
}

export function* postOfferSaga(action) {
  yield put(actions.postOfferStart());

  try {
    const response = yield call(fetch, `${API_BASE_URL}offers.json?auth=${action.token}`, {
      method: 'POST',
      body: JSON.stringify(action.offer),
      headers: { 'Content-Type': 'application/json' }
    });
    const responseBody = yield response.json();
    if (responseBody.error) {
      console.log('responseBody error', responseBody);
      yield put(actions.postOfferFail(responseBody.error));
    } else {
      yield put(actions.postOfferSuccess());
    }
  } catch (error) {
    yield put(actions.postOfferFail(error));
  }
}
