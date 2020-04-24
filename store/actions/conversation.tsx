import {ConversationActionTypes} from './actionTypes';
import { Conversation, Message } from "../../shared/types/conversation.type";
import { Action } from "redux";
import { Firebase } from "../../firebase/firebase";

// POST CONVERSATION

interface PostConversationAction extends Action<ConversationActionTypes.POST_CONVERSATION> {
  conversation: Conversation;
  firebase: Firebase;
}
export const postConversation = (
  conversation: Conversation,
  firebase: Firebase,
): PostConversationAction => {
  return {
    type: ConversationActionTypes.POST_CONVERSATION,
    conversation,
    firebase,
  }
};

export const postConversationStart = (
): Action<ConversationActionTypes.POST_CONVERSATION_START> => {
  return {
    type: ConversationActionTypes.POST_CONVERSATION_START,
  }
};

interface PostConversationSuccessAction extends Action<ConversationActionTypes.POST_CONVERSATION_SUCCESS> {
  id: string;
}
export const postConversationSuccess = (
  id: string
): PostConversationSuccessAction => {
  return {
    type: ConversationActionTypes.POST_CONVERSATION_SUCCESS,
    id,
  }
};

interface PostConversationFailAction extends Action<ConversationActionTypes.POST_CONVERSATION_FAIL> {
  error: Error;
}
export const postConversationFail = (
  error: Error,
): PostConversationFailAction => {
  return {
    type: ConversationActionTypes.POST_CONVERSATION_FAIL,
    error,
  }
};

export const postConversationClear = (
): Action<ConversationActionTypes.POST_CONVERSATION_CLEAR> => {
  return {
    type: ConversationActionTypes.POST_CONVERSATION_CLEAR,
  }
};

// GET CONVERSATION

interface GetConversationAction extends Action<ConversationActionTypes.GET_CONVERSATION> {
  conversationId: string;
  firebase: Firebase;
}
export const getConversation = (
  conversationId: string,
  firebase: Firebase,
): GetConversationAction => {
  return {
    type: ConversationActionTypes.GET_CONVERSATION,
    conversationId,
    firebase,
  }
};

export const getConversationStart = (
): Action<ConversationActionTypes.GET_CONVERSATION_START> => {
  return {
    type: ConversationActionTypes.GET_CONVERSATION_START,
  }
};

interface GetConversationSuccessAction extends Action<ConversationActionTypes.GET_CONVERSATION_SUCCESS> {
  conversation: Conversation;
}
export const getConversationSuccess = (
  conversation: Conversation,
): GetConversationSuccessAction => {
  return {
    type: ConversationActionTypes.GET_CONVERSATION_SUCCESS,
    conversation,
  }
};

interface GetConversationFailAction extends Action<ConversationActionTypes.GET_CONVERSATION_FAIL> {
  error: Error;
}
export const getConversationFail = (
  error: Error,
): GetConversationFailAction => {
  return {
    type: ConversationActionTypes.GET_CONVERSATION_FAIL,
    error,
  }
};

export const getConversationClear = (
): Action<ConversationActionTypes.GET_CONVERSATION_CLEAR> => {
  return {
    type: ConversationActionTypes.GET_CONVERSATION_CLEAR,
  }
};

// CHECK CONVERSATION

interface CheckConversationAction extends Action<ConversationActionTypes.CHECK_CONVERSATION> {
  conversation: Conversation;
  firebase: Firebase;
}
export const checkConversation = (
  conversation: Conversation,
  firebase: Firebase,
): CheckConversationAction => {
  return {
    type: ConversationActionTypes.CHECK_CONVERSATION,
    conversation,
    firebase,
  }
};

export const checkConversationStart = (
): Action<ConversationActionTypes.CHECK_CONVERSATION_START> => {
  return {
    type: ConversationActionTypes.CHECK_CONVERSATION_START,
  }
};

interface CheckConversationSuccessAction extends Action<ConversationActionTypes.CHECK_CONVERSATION_SUCCESS> {
  hasConversation: boolean;
}
export const checkConversationSuccess = (
  hasConversation: boolean,
): CheckConversationSuccessAction => {
  return {
    type: ConversationActionTypes.CHECK_CONVERSATION_SUCCESS,
    hasConversation,
  }
};

interface CheckConversationFailAction extends Action<ConversationActionTypes.CHECK_CONVERSATION_FAIL> {
  error: Error;
}
export const checkConversationFail = (
  error: Error,
): CheckConversationFailAction => {
  return {
    type: ConversationActionTypes.CHECK_CONVERSATION_FAIL,
    error,
  }
};

export const checkConversationClear = (
): Action<ConversationActionTypes.CHECK_CONVERSATION_CLEAR> => {
  return {
    type: ConversationActionTypes.CHECK_CONVERSATION_CLEAR,
  }
};

// SEND MESSAGE

interface SendMessageAction extends Action<ConversationActionTypes.SEND_MESSAGE> {
  message: string;
  conversationId: string;
  firebase: Firebase;
}
export const sendMessage = (
  message: string,
  conversationId: string,
  firebase: Firebase
): SendMessageAction => {
  return {
    type: ConversationActionTypes.SEND_MESSAGE,
    message,
    conversationId,
    firebase,
  }
};

export const sendMessageStart = (
): Action<ConversationActionTypes.SEND_MESSAGE_START> => {
  return {
    type: ConversationActionTypes.SEND_MESSAGE_START,
  }
};

interface SendMessageSuccessAction extends Action<ConversationActionTypes.SEND_MESSAGE_SUCCESS> {
  id: string;
}
export const sendMessageSuccess = (
  id: string,
): SendMessageSuccessAction => {
  return {
    type: ConversationActionTypes.SEND_MESSAGE_SUCCESS,
    id,
  }
};

interface SendMessageFailAction extends Action<ConversationActionTypes.SEND_MESSAGE_FAIL> {
  error: Error;
}
export const sendMessageFail = (
  error: Error,
): SendMessageFailAction => {
  return {
    type: ConversationActionTypes.SEND_MESSAGE_FAIL,
    error,
  }
};

export const sendMessageClear = (
): Action<ConversationActionTypes.SEND_MESSAGE_CLEAR> => {
  return {
    type: ConversationActionTypes.SEND_MESSAGE_CLEAR,
  }
};

// GET CONVERSATIONS

interface GetConversationsAction extends Action<ConversationActionTypes.GET_CONVERSATIONS> {
  firebase: Firebase;
}
export const getConversations = (
  firebase: Firebase,
): GetConversationsAction => {
  return {
    type: ConversationActionTypes.GET_CONVERSATIONS,
    firebase,
  }
};

export const getConversationsStart = (
): Action<ConversationActionTypes.GET_CONVERSATIONS_START> => {
  return {
    type: ConversationActionTypes.GET_CONVERSATIONS_START,
  }
};

interface GetConversationsSuccessAction extends Action<ConversationActionTypes.GET_CONVERSATIONS_SUCCESS> {
  conversations: Conversation[];
}
export const getConversationsSuccess = (
  conversations: Conversation[],
): GetConversationsSuccessAction => {
  return {
    type: ConversationActionTypes.GET_CONVERSATIONS_SUCCESS,
    conversations,
  }
};

interface GetConversationsFailAction extends Action<ConversationActionTypes.GET_CONVERSATIONS_FAIL> {
  error: Error;
}
export const getConversationsFail = (
  error: Error,
): GetConversationsFailAction => {
  return {
    type: ConversationActionTypes.GET_CONVERSATIONS_FAIL,
    error,
  }
};

export const getConversationsClear = (
): Action<ConversationActionTypes.GET_CONVERSATIONS_CLEAR> => {
  return {
    type: ConversationActionTypes.GET_CONVERSATIONS_CLEAR,
  }
};

export type ConversationAction =
  | PostConversationAction
  | Action<ConversationActionTypes.POST_CONVERSATION_START>
  | PostConversationSuccessAction
  | PostConversationFailAction
  | Action<ConversationActionTypes.POST_CONVERSATION_CLEAR>
  | GetConversationAction
  | Action<ConversationActionTypes.GET_CONVERSATION_START>
  | GetConversationSuccessAction
  | GetConversationFailAction
  | Action<ConversationActionTypes.GET_CONVERSATION_CLEAR>
  | CheckConversationAction
  | Action<ConversationActionTypes.CHECK_CONVERSATION_START>
  | CheckConversationSuccessAction
  | CheckConversationFailAction
  | Action<ConversationActionTypes.CHECK_CONVERSATION_CLEAR>
  | SendMessageAction
  | Action<ConversationActionTypes.SEND_MESSAGE_START>
  | SendMessageSuccessAction
  | SendMessageFailAction
  | Action<ConversationActionTypes.SEND_MESSAGE_CLEAR>
  | GetConversationsAction
  | Action<ConversationActionTypes.GET_CONVERSATIONS_START>
  | GetConversationsSuccessAction
  | GetConversationsFailAction
  | Action<ConversationActionTypes.GET_CONVERSATIONS_CLEAR>
;
