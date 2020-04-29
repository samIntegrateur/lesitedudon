import { Conversation } from "../../shared/types/conversation.type";
import { ApiStateItem } from "./common.type";

export interface PostConversationState extends ApiStateItem {
  newConversationId: string | null;
}

export interface CheckConversationState extends ApiStateItem {
  hasConversation: boolean | string | null;
}

export enum ConversationApiState {
  POST_CONVERSATION = 'postConversation',
  GET_CONVERSATION = 'getConversation',
  GET_CONVERSATIONS = 'getConversations',
  CHECK_CONVERSATION = 'checkConversation',
  SEND_MESSAGE = 'sendMessage',
}

export interface ConversationState {
  conversationId: string | null;
  conversation: Conversation | null;
  conversations: Conversation[] | null;
  apiState: {
    [ConversationApiState.POST_CONVERSATION]: PostConversationState;
    [ConversationApiState.GET_CONVERSATION]: ApiStateItem;
    [ConversationApiState.GET_CONVERSATIONS]: ApiStateItem;
    [ConversationApiState.CHECK_CONVERSATION]: CheckConversationState;
    [ConversationApiState.SEND_MESSAGE]: ApiStateItem;
  };
}
