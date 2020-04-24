import {updateObject, updateApiState} from '../../shared/utility';
import { ConversationApiState, ConversationState } from "../types/conversation.type";
import { commonApiStateItemInitial } from "../utils";
import { ConversationActionTypes } from "../actions/actionTypes";
import { Reducer } from "redux";
import { ConversationAction } from "../actions";

const initialState: ConversationState = {
  conversationId: null,
  conversation: null,
  conversations: null,
  apiState: {
    [ConversationApiState.POST_CONVERSATION]: {
      ...commonApiStateItemInitial,
      newConversationId: null,
    },
    [ConversationApiState.GET_CONVERSATION]: {
      ...commonApiStateItemInitial,
    },
    [ConversationApiState.CHECK_CONVERSATION]: {
      ...commonApiStateItemInitial,
      hasConversation: null,
    },
    [ConversationApiState.SEND_MESSAGE]: {
      ...commonApiStateItemInitial,
    },
    [ConversationApiState.GET_CONVERSATIONS]: {
      ...commonApiStateItemInitial,
    },
  },
};

const conversationReducer: Reducer<ConversationState, ConversationAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ConversationActionTypes.POST_CONVERSATION_START: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.POST_CONVERSATION, {
          error: null,
          success: false,
          loading: true,
        })
      });
    }
    case ConversationActionTypes.POST_CONVERSATION_SUCCESS: {
      return updateObject(state, {
        conversationId: action.id,
        apiState: updateApiState(state.apiState, ConversationApiState.POST_CONVERSATION, {
          success: true,
          loading: false,
          newConversationId: action.id,
        })
      });
    }
    case ConversationActionTypes.POST_CONVERSATION_FAIL: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.POST_CONVERSATION, {
          error: action.error,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.POST_CONVERSATION_CLEAR: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.POST_CONVERSATION, {
          error: null,
          success: false,
          newConversationId: null,
        })
      });
    }

    case ConversationActionTypes.GET_CONVERSATION_START: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.GET_CONVERSATION, {
          error: null,
          success: false,
          loading: true,
        })
      });
    }
    case ConversationActionTypes.GET_CONVERSATION_SUCCESS: {
      return updateObject(state, {
        conversation: action.conversation,
        apiState: updateApiState(state.apiState, ConversationApiState.GET_CONVERSATION, {
          success: true,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.GET_CONVERSATION_FAIL: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.GET_CONVERSATION, {
          error: action.error,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.GET_CONVERSATION_CLEAR: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState,  ConversationApiState.GET_CONVERSATION, {
          error: null,
          success: false,
        })
      });
    }

    case ConversationActionTypes.CHECK_CONVERSATION_START: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.CHECK_CONVERSATION, {
          error: null,
          success: false,
          loading: true,
        })
      });
    }
    case ConversationActionTypes.CHECK_CONVERSATION_SUCCESS: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.CHECK_CONVERSATION, {
          success: true,
          loading: false,
          hasConversation: action.hasConversation,
        })
      });
    }
    case ConversationActionTypes.CHECK_CONVERSATION_FAIL: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.CHECK_CONVERSATION, {
          error: action.error,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.CHECK_CONVERSATION_CLEAR: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.CHECK_CONVERSATION, {
          error: null,
          success: false,
          hasConversation: null,
        })
      });
    }

    case ConversationActionTypes.SEND_MESSAGE_START: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.SEND_MESSAGE, {
          error: null,
          success: false,
          loading: true,
        })
      });
    }
    case ConversationActionTypes.SEND_MESSAGE_SUCCESS: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.SEND_MESSAGE, {
          success: true,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.SEND_MESSAGE_FAIL: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.SEND_MESSAGE, {
          error: action.error,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.SEND_MESSAGE_CLEAR: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.SEND_MESSAGE, {
          error: null,
          success: false,
        })
      });
    }

    case ConversationActionTypes.GET_CONVERSATIONS_START: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.GET_CONVERSATIONS, {
          error: null,
          success: false,
          loading: true,
        })
      });
    }
    case ConversationActionTypes.GET_CONVERSATIONS_SUCCESS: {
      return updateObject(state, {
        conversations: action.conversations,
        apiState: updateApiState(state.apiState, ConversationApiState.GET_CONVERSATIONS, {
          success: true,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.GET_CONVERSATIONS_FAIL: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, ConversationApiState.GET_CONVERSATIONS, {
          error: action.error,
          loading: false,
        })
      });
    }
    case ConversationActionTypes.GET_CONVERSATIONS_CLEAR: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState,  ConversationApiState.GET_CONVERSATIONS, {
          error: null,
          success: false,
        })
      });
    }
    default:
      return state;
  }
};

export default conversationReducer;
