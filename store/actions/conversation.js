import * as actionTypes from './actionTypes';

// POST CONVERSATION
export const postConversation = (conversation, firebase) => {
  return {
    type: actionTypes.POST_CONVERSATION,
    conversation,
    firebase,
  }
};

export const postConversationStart = () => {
  return {
    type: actionTypes.POST_CONVERSATION_START,
  }
};

export const postConversationSuccess = (id) => {
  return {
    type: actionTypes.POST_CONVERSATION_SUCCESS,
    id,
  }
};

export const postConversationFail = (error) => {
  return {
    type: actionTypes.POST_CONVERSATION_FAIL,
    error,
  }
};

export const postConversationClear = () => {
  return {
    type: actionTypes.POST_CONVERSATION_CLEAR,
  }
};

// GET CONVERSATION
export const getConversation = (conversationId, firebase) => {
  return {
    type: actionTypes.GET_CONVERSATION,
    conversationId,
    firebase,
  }
};

export const getConversationStart = () => {
  return {
    type: actionTypes.GET_CONVERSATION_START,
  }
};

export const getConversationSuccess = (conversation) => {
  return {
    type: actionTypes.GET_CONVERSATION_SUCCESS,
    conversation,
  }
};

export const getConversationFail = (error) => {
  return {
    type: actionTypes.GET_CONVERSATION_FAIL,
    error,
  }
};

export const getConversationClear = () => {
  return {
    type: actionTypes.GET_CONVERSATION_CLEAR,
  }
};


// CHECK CONVERSATION
export const checkConversation = (conversation, firebase) => {
  return {
    type: actionTypes.CHECK_CONVERSATION,
    conversation,
    firebase,
  }
};

export const checkConversationStart = () => {
  return {
    type: actionTypes.CHECK_CONVERSATION_START,
  }
};

export const checkConversationSuccess = (hasConversation) => {
  return {
    type: actionTypes.CHECK_CONVERSATION_SUCCESS,
    hasConversation,
  }
};

export const checkConversationFail = (error) => {
  return {
    type: actionTypes.CHECK_CONVERSATION_FAIL,
    error,
  }
};

export const checkConversationClear = () => {
  return {
    type: actionTypes.CHECK_CONVERSATION_CLEAR,
  }
};

// SEND MESSAGE
export const sendMessage = (message, conversationId, firebase) => {
  return {
    type: actionTypes.SEND_MESSAGE,
    message,
    conversationId,
    firebase,
  }
};

export const sendMessageStart = () => {
  return {
    type: actionTypes.SEND_MESSAGE_START,
  }
};

export const sendMessageSuccess = (id) => {
  return {
    type: actionTypes.SEND_MESSAGE_SUCCESS,
    id,
  }
};

export const sendMessageFail = (error) => {
  return {
    type: actionTypes.SEND_MESSAGE_FAIL,
    error,
  }
};

export const sendMessageClear = () => {
  return {
    type: actionTypes.SEND_MESSAGE_CLEAR,
  }
};

// GET CONVERSATIONS
export const getConversations = (firebase) => {
  return {
    type: actionTypes.GET_CONVERSATIONS,
    firebase,
  }
};

export const getConversationsStart = () => {
  return {
    type: actionTypes.GET_CONVERSATIONS_START,
  }
};

export const getConversationsSuccess = (conversations) => {
  return {
    type: actionTypes.GET_CONVERSATIONS_SUCCESS,
    conversations,
  }
};

export const getConversationsFail = (error) => {
  return {
    type: actionTypes.GET_CONVERSATIONS_FAIL,
    error,
  }
};

export const getConversationsClear = () => {
  return {
    type: actionTypes.GET_CONVERSATIONS_CLEAR,
  }
};
