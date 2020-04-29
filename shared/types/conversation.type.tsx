import { ApiTimeStamp } from "./dates.type";
import { FixedLengthArray } from "./utils.type";
import { Offer } from "./offer.type";

interface MessageCommon {
  isRead: boolean;
  message: string;
  user: string;
}

export interface MessageFromApi extends MessageCommon {
  timestamp: ApiTimeStamp;
}

export interface Message extends MessageCommon {
  timestamp: Date;
}

interface ConversationCommon {
  askerUser: string;
  receiverUser: string;
  offer: string | Offer;
  users: FixedLengthArray<[string, string]>;
  // Todo: can we specify that we need 2 entities
  // which keys are askerUser and receiverUser values ?
  unreadMessages: {
    [key: string]: number;
  };
}

// Before sanitize
export interface ConversationFromApi extends ConversationCommon {
  dateCreated: ApiTimeStamp;
  dateUpdated: ApiTimeStamp;
  messages: MessageFromApi[];
}

// After sanitize
export interface Conversation extends ConversationCommon {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  messages: Message[];
}

// Args needed for calling cloud function
export interface ConversationForCreation {
  offerId: string;
  askerUserId: string;
  receiverUserId: string;
}
