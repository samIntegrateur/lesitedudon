import { takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import {fetchOffersSaga, postOfferSaga, fetchOfferSaga} from './offer';
import {authCheckStateSaga, authUserSaga, checkAuthTimeoutSaga, logoutSaga} from './auth';

export function* watchAuth() {
  yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
  yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
  yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
  yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
}

export function* watchOffer() {
  yield takeEvery(actionTypes.FETCH_OFFERS, fetchOffersSaga);
  yield takeEvery(actionTypes.FETCH_OFFER, fetchOfferSaga);
  yield takeEvery(actionTypes.POST_OFFER, postOfferSaga);
}
