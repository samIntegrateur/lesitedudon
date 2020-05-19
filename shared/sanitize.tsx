
// There are differences between what api rest returns and what firebase functions does
import FireStoreParser from 'firestore-parser';
import {convertUnixTime} from './utility';
import { Offer, OfferFromApi } from "./types/offer.type";
import firebase from "firebase";
import { Conversation, ConversationDataFromApi, MessageFromApi } from "./types/conversation.type";

// ex get 123 from "lorem/ipsum/123";
export const extractIdFromPath = (path: string): string => {
  const pathArray = path.split("/");
  return pathArray[pathArray.length - 1];
};

// Get id list for getStaticPaths
export const getOffersIds = (data: any): string[] => {
  const offersId: string[]  = [];
  data.documents.forEach((document: any) => {
    const id = extractIdFromPath(document.name);
    offersId.push(id);
  });
  return offersId;
};


// todo : specifify incoming type (cf: https://www.npmjs.com/package/firestore-parser)
// if parse = false, type is OfferWithFields
export const sanitizeOfferFromRest = (offer: any, parse = true): Offer => {
  const parsedOffer = parse ? FireStoreParser(offer) : offer;

  return {
    id: extractIdFromPath(parsedOffer.name),
    ...parsedOffer.fields,
    author: extractIdFromPath(parsedOffer.fields.author),
  };
};

// todo : specifify incoming type (cf: https://www.npmjs.com/package/firestore-parser)
export const sanitizeOffersFromRest = (data: any): Offer[] => {

  const parsedData = FireStoreParser(data);

  const sanitizedOffersData: Offer[] = [];
  parsedData.documents.forEach((document: any) => {
    sanitizedOffersData.push(
      sanitizeOfferFromRest(document, false)
    );
  });
  return sanitizedOffersData;
};

export const sanitizeOfferFromFirebase = (
  offer: firebase.firestore.DocumentData | OfferFromApi,
  isSnapshot = true,
): Offer => {

  let itemData;

  if (isSnapshot) {
    offer = offer as firebase.firestore.DocumentData;
    itemData = offer.data();
  } else {
    offer = offer as OfferFromApi;
    itemData = offer;
  }

  return {
    ...itemData,
    id: offer.id,
    // Here we receive the whole author reference, but we just want the id
    author: itemData.author.id || itemData.author.username,
    // Convert date timestamp
    dateCreated: convertUnixTime(itemData.dateCreated),
    dateUpdated: convertUnixTime(itemData.dateUpdated),
  }
};


// For firebase.js functions
export const sanitizeOffersFromFirebase = (
  snapshot: firebase.firestore.QuerySnapshot
): Offer[] => {
  const offers: Offer[] = [];
  if (snapshot.empty) {
    return offers;
  }

  snapshot.forEach((doc: firebase.firestore.DocumentData) => {
    offers.push(sanitizeOfferFromFirebase(doc));
  });
  return offers;
};

export const sanitizeConversationFromFirebase = (
  conversation: firebase.firestore.DocumentData | ConversationDataFromApi,
  isSnapshot = true,
  skipOffer = false,
): Conversation => {

  let itemData, offer;

  if (isSnapshot) {
    conversation = conversation as firebase.firestore.DocumentData;
    itemData = conversation.data();
  } else {
    conversation = conversation as ConversationDataFromApi;
    itemData = conversation.datas;
  }

  // nb: conversation.data() will not get data for the offer reference (ex: subscribeToConversation)
  // Sadly firestore doesn't seem to have a "populate" reference option
  // so in this case we use skipOffer to get only the id and call the offer separately
  if (skipOffer) {
    offer = itemData.offer.id;
  } else {
    offer = sanitizeOfferFromFirebase(itemData.offer, false);
  }

  console.log('conversation itemData', itemData);
  return {
    ...itemData,
    id: conversation.id,
    offer: offer,
    dateCreated: convertUnixTime(itemData.dateCreated),
    dateUpdated: convertUnixTime(itemData.dateUpdated),
    messages:  itemData.messages
      ? itemData.messages.map((message: MessageFromApi) => {
        return {
          ...message,
          timestamp: convertUnixTime(message.timestamp)
        }
      })
      : []
  }
};

// Snapshot is what we get from a "direct call"
// The other is what we return from custom could function
export const sanitizeConversationsFromFirebase = (
  datas: firebase.firestore.DocumentData | ConversationDataFromApi[],
  isSnapshot = true
): Conversation[] => {
  const conversations: Conversation[] = [];

  if (isSnapshot) {
    datas = datas as firebase.firestore.DocumentData;
    if (datas.empty) {
      return conversations;
    }
  } else {
    datas = datas as ConversationDataFromApi;
  }

  datas.forEach((doc: firebase.firestore.DocumentData | ConversationDataFromApi) => {
    conversations.push(sanitizeConversationFromFirebase(doc, isSnapshot));
  });
  console.log('conversations', conversations);
  return conversations;
};
