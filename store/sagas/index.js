import { takeEvery, all } from 'redux-saga/effects';
import {fetchOffersSaga, postOfferSaga, fetchOfferSaga} from './offer';
import {authCheckStateSaga, authUserSaga, checkAuthTimeoutSaga, logoutSaga} from './auth';
import {
  postConversationSaga,
  getConversationSaga,
  checkConversationSaga,
  sendMessageSaga,
  getConversationsSaga,
} from './conversation';
import { AuthActionTypes, ConversationActionTypes, OfferActionTypes } from "../actions/actionTypes";

// NB: saga typing seems to be a pain in the ass (https://github.com/Microsoft/TypeScript/issues/2983#issuecomment-230404301)
// try https://github.com/agiledigital/typed-redux-saga ?

export function* watchAuth() {
  yield takeEvery(AuthActionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
  yield takeEvery(AuthActionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
  yield takeEvery(AuthActionTypes.AUTH_USER, authUserSaga);
  yield takeEvery(AuthActionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
}

export function* watchOffer() {
  yield takeEvery(OfferActionTypes.FETCH_OFFERS, fetchOffersSaga);
  yield takeEvery(OfferActionTypes.FETCH_OFFER, fetchOfferSaga);
  yield takeEvery(OfferActionTypes.POST_OFFER, postOfferSaga);
}

export function* watchConversation() {
  yield takeEvery(ConversationActionTypes.POST_CONVERSATION, postConversationSaga);
  yield takeEvery(ConversationActionTypes.GET_CONVERSATION, getConversationSaga);
  yield takeEvery(ConversationActionTypes.CHECK_CONVERSATION, checkConversationSaga);
  yield takeEvery(ConversationActionTypes.SEND_MESSAGE, sendMessageSaga);
  yield takeEvery(ConversationActionTypes.GET_CONVERSATIONS, getConversationsSaga);
}
