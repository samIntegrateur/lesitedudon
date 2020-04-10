import * as actions from '../actions';
import {put, call} from 'redux-saga/effects';

export function* postConversationSaga({conversation, firebase}) {

  yield put(actions.postConversationStart());

  try {
    const response = yield call(firebase.postConversation, conversation);
    // const responseBody = yield response.json();
    if (response.error) {
      yield put(actions.postConversationFail(response.error));
    } else {
      yield put(actions.postConversationSuccess(response.data));
    }
  } catch (error) {
    yield put(actions.postConversationFail(error));
  }
}

export function* getConversationSaga({conversationId, firebase}) {

  yield put(actions.getConversationStart());

  try {
    const response = yield call(firebase.getConversation, {conversationId});

    // const responseBody = yield response.json();
    if (response.error) {
      yield put(actions.getConversationFail(response.error));
    } else {
      yield put(actions.getConversationSuccess(response.data));
    }
  } catch (error) {
    yield put(actions.getConversationFail(error));
  }
}

export function* checkConversationSaga({conversation, firebase}) {

  yield put(actions.checkConversationStart());

  try {
    const response = yield call(firebase.checkConversation, conversation);
    // const responseBody = yield response.json();
    if (response.error) {
      yield put(actions.checkConversationFail(response.error));
    } else {
      yield put(actions.checkConversationSuccess(response.data));
    }
  } catch (error) {
    yield put(actions.checkConversationFail(error));
  }
}

export function* sendMessageSaga({message, conversationId, firebase}) {

  yield put(actions.sendMessageStart());

  try {
    const response = yield call(firebase.sendMessage, {message, conversationId});
    // const responseBody = yield response.json();
    if (response.error) {
      yield put(actions.sendMessageFail(response.error));
    } else {
      yield put(actions.sendMessageSuccess(response.data));
    }
  } catch (error) {
    yield put(actions.sendMessageFail(error));
  }
}
