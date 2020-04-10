import * as actionTypes from '../actions/actionTypes';
import {updateObject, updateApiState} from '../../shared/utility';

const API_STATE_ACTION = {
  postConversation: 'postConversation',
  getConversation: 'getConversation',
  checkConversation: 'checkConversation',
  sendMessage: 'sendMessage',
};

const initialState = {
  conversationId: null,
  conversation: null,
  apiState: {
    postConversation: {
      error: null,
      success: false,
      loading: false,
      newConversationId: null,
    },
    getConversation: {
      error: null,
      success: false,
      loading: false,
    },
    checkConversation: {
      error: null,
      success: false,
      loading: false,
      hasConversation: null,
    },
    sendMessage: {
      error: null,
      success: false,
      loading: false,
    },
  },
};

// todo: this is redudant, refactor it
const postConversationStart = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.postConversation, {
      error: null,
      success: false,
      loading: true,
    })
  });
};

const postConversationSuccess = (state, action) => {
  return updateObject(state, {
    conversationId: action.id,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.postConversation, {
      success: true,
      loading: false,
      newConversationId: action.id,
    })
  });
};

const postConversationFail = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.postConversation, {
      error: action.error,
      loading: false,
    })
  });
};

const postConversationClear = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.postConversation, {
      error: null,
      success: false,
      newConversationId: null,
    })
  });
};

const getConversationStart = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.getConversation, {
      error: null,
      success: false,
      loading: true,
    })
  });
};

const getConversationSuccess = (state, action) => {
  return updateObject(state, {
    conversation: action.conversation,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.getConversation, {
      success: true,
      loading: false,
    })
  });
};

const getConversationFail = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.getConversation, {
      error: action.error,
      loading: false,
    })
  });
};

const getConversationClear = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState,  API_STATE_ACTION.getConversation, {
      error: null,
      success: false,
    })
  });
};

const checkConversationStart = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.checkConversation, {
      error: null,
      success: false,
      loading: true,
    })
  });
};

const checkConversationSuccess = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.checkConversation, {
      success: true,
      loading: false,
      hasConversation: action.hasConversation,
    })
  });
};

const checkConversationFail = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.checkConversation, {
      error: action.error,
      loading: false,
    })
  });
};

const checkConversationClear = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.checkConversation, {
      error: null,
      success: false,
      hasConversation: null,
    })
  });
};

const sendMessageStart = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.sendMessage, {
      error: null,
      success: false,
      loading: true,
    })
  });
};

const sendMessageSuccess = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.sendMessage, {
      success: true,
      loading: false,
    })
  });
};

const sendMessageFail = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.sendMessage, {
      error: action.error,
      loading: false,
    })
  });
};

const sendMessageClear = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, API_STATE_ACTION.sendMessage, {
      error: null,
      success: false,
    })
  });
};

const conversationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_CONVERSATION_START: return postConversationStart(state, action);
    case actionTypes.POST_CONVERSATION_SUCCESS: return postConversationSuccess(state, action);
    case actionTypes.POST_CONVERSATION_FAIL: return postConversationFail(state, action);
    case actionTypes.POST_CONVERSATION_CLEAR: return postConversationClear(state, action);

    case actionTypes.GET_CONVERSATION_START: return getConversationStart(state, action);
    case actionTypes.GET_CONVERSATION_SUCCESS: return getConversationSuccess(state, action);
    case actionTypes.GET_CONVERSATION_FAIL: return getConversationFail(state, action);
    case actionTypes.GET_CONVERSATION_CLEAR: return getConversationClear(state, action);

    case actionTypes.CHECK_CONVERSATION_START: return checkConversationStart(state, action);
    case actionTypes.CHECK_CONVERSATION_SUCCESS: return checkConversationSuccess(state, action);
    case actionTypes.CHECK_CONVERSATION_FAIL: return checkConversationFail(state, action);
    case actionTypes.CHECK_CONVERSATION_CLEAR: return checkConversationClear(state, action);

    case actionTypes.SEND_MESSAGE_START: return sendMessageStart(state, action);
    case actionTypes.SEND_MESSAGE_SUCCESS: return sendMessageSuccess(state, action);
    case actionTypes.SEND_MESSAGE_FAIL: return sendMessageFail(state, action);
    case actionTypes.SEND_MESSAGE_CLEAR: return sendMessageClear(state, action);
    default:
      return state;
  }
};

export default conversationReducer;
