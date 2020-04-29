import { CheckConversationState, ConversationApiState, PostConversationState } from "./conversation.type";
import { OfferApiState, PostOfferState } from "./offer.type";

export interface ApiStateItem {
  error?: Error | null;
  success?: boolean;
  loading?: boolean;
}

export interface ApiState {
  [key: string]: ApiStateItemAlike;
}

export type ApiStateItemAlike =
  | ApiStateItem
  | PostConversationState
  | CheckConversationState
  | PostOfferState
;

export type ApiStateActions =
  | ConversationApiState
  | OfferApiState
;
