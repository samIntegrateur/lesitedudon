import { takeEvery, all } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import {fetchOffersSaga, postOfferSaga, fetchOfferSaga} from './offer';
import {authCheckStateSaga, authUserSaga, checkAuthTimeoutSaga, logoutSaga} from './auth';
import {
  postConversationSaga,
  getConversationSaga,
  checkConversationSaga,
  sendMessageSaga,
  getConversationsSaga,
} from './conversation';

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

export function* watchConversation() {
  yield takeEvery(actionTypes.POST_CONVERSATION, postConversationSaga);
  yield takeEvery(actionTypes.GET_CONVERSATION, getConversationSaga);
  yield takeEvery(actionTypes.CHECK_CONVERSATION, checkConversationSaga);
  yield takeEvery(actionTypes.SEND_MESSAGE, sendMessageSaga);
  yield takeEvery(actionTypes.GET_CONVERSATIONS, getConversationsSaga);
}
