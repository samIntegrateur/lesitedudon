import { AuthState } from "./auth";
import { ConversationState } from "./conversation.type";
import { OfferState } from "./offer.type";

export interface StoreState {
  auth: AuthState;
  conversation: ConversationState;
  offer: OfferState;
}
