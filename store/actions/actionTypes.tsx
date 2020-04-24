// NB: we don't use anymore fetches actions as it is handled with getStaticProps in pages
// maybe delete this and replace with action to dispatch from props to store if needed.

export enum OfferActionTypes {
  FETCH_OFFERS = 'FETCH_OFFERS',
  FETCH_OFFERS_START = 'FETCH_OFFERS_START',
  FETCH_OFFERS_SUCCESS = 'FETCH_OFFERS_SUCCESS',
  FETCH_OFFERS_FAIL = 'FETCH_OFFERS_FAIL',

  FETCH_OFFER = 'FETCH_OFFER',
  FETCH_OFFER_START = 'FETCH_OFFER_START',
  FETCH_OFFER_SUCCESS = 'FETCH_OFFER_SUCCESS',
  FETCH_OFFER_FAIL = 'FETCH_OFFER_FAIL',

  POST_OFFER = 'POST_OFFER',
  POST_OFFER_START = 'POST_OFFER_START',
  POST_OFFER_SUCCESS = 'POST_OFFER_SUCCESS',
  POST_OFFER_FAIL = 'POST_OFFER_FAIL',
  POST_OFFER_CLEAR = 'POST_OFFER_CLEAR',
}

export enum AuthActionTypes {
  AUTH_CHECK_STATE = 'AUTH_CHECK_STATE',
  AUTH_START = 'AUTH_START',
  AUTH_USER = 'AUTH_USER',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAIL = 'AUTH_FAIL',
  AUTH_CHECK_TIMEOUT = 'AUTH_CHECK_TIMEOUT',
  AUTH_INITIATE_LOGOUT = 'AUTH_INITIATE_LOGOUT',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  AUTH_SET_FIRST_CHECK = 'AUTH_SET_FIRST_CHECK',
}

export enum ConversationActionTypes {
  POST_CONVERSATION = 'POST_CONVERSATION',
  POST_CONVERSATION_START = 'POST_CONVERSATION_START',
  POST_CONVERSATION_SUCCESS = 'POST_CONVERSATION_SUCCESS',
  POST_CONVERSATION_FAIL = 'POST_CONVERSATION_FAIL',
  POST_CONVERSATION_CLEAR = 'POST_CONVERSATION_CLEAR',
  
  CHECK_CONVERSATION = 'CHECK_CONVERSATION',
  CHECK_CONVERSATION_START = 'CHECK_CONVERSATION_START',
  CHECK_CONVERSATION_SUCCESS = 'CHECK_CONVERSATION_SUCCESS',
  CHECK_CONVERSATION_FAIL = 'CHECK_CONVERSATION_FAIL',
  CHECK_CONVERSATION_CLEAR = 'CHECK_CONVERSATION_CLEAR',
  
  GET_CONVERSATION = 'GET_CONVERSATION',
  GET_CONVERSATION_START = 'GET_CONVERSATION_START',
  GET_CONVERSATION_SUCCESS = 'GET_CONVERSATION_SUCCESS',
  GET_CONVERSATION_FAIL = 'GET_CONVERSATION_FAIL',
  GET_CONVERSATION_CLEAR = 'GET_CONVERSATION_CLEAR',
  
  GET_CONVERSATIONS = 'GET_CONVERSATIONS',
  GET_CONVERSATIONS_START = 'GET_CONVERSATIONS_START',
  GET_CONVERSATIONS_SUCCESS = 'GET_CONVERSATIONS_SUCCESS',
  GET_CONVERSATIONS_FAIL = 'GET_CONVERSATIONS_FAIL',
  GET_CONVERSATIONS_CLEAR = 'GET_CONVERSATIONS_CLEAR',
  
  SEND_MESSAGE = 'SEND_MESSAGE',
  SEND_MESSAGE_START = 'SEND_MESSAGE_START',
  SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS',
  SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL',
  SEND_MESSAGE_CLEAR = 'SEND_MESSAGE_CLEAR',
}