
// There are differences between what api rest returns and what firebase functions does
import FireStoreParser from 'firestore-parser';
import {convertUnixTime} from './utility';
import { Offer } from "./types/offer.type";
import firebase from "firebase";
import { Conversation } from "./types/conversation.type";

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
  console.log('data', data);

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
  offer: firebase.firestore.DocumentData,
): Offer => {
  const itemData = offer.data();
  return {
    ...itemData,
    id: offer.id,
    // Here we receive the whole author reference, but we just want the id
    author: itemData.author.id,
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

// todo: specify type (either firebase.firestore.QuerySnapshot or "dataWithId")
export const sanitizeConversationFromFirebase = (
  conversation: any,
  isSnapshot = true,
): Conversation => {
  const itemData = isSnapshot ? conversation.data() : conversation.datas;

  return {
    ...itemData,
    id: conversation.id,
    dateCreated: convertUnixTime(itemData.dateCreated),
    dateUpdated: convertUnixTime(itemData.dateUpdated),
    messages:  itemData.messages
      ? itemData.messages.map((message: any) => {
        return {
          ...message,
          timestamp: convertUnixTime(message.timestamp)
        }
      })
      : []
  }
};

export const sanitizeConversationsFromFirebase = (
  datas: any,
  isSnapshot = true
): Conversation[] => {
  const conversations: Conversation[] = [];
  if (isSnapshot && datas.empty) {
    return conversations;
  }

  datas.forEach((doc: any) => {
    conversations.push(sanitizeConversationFromFirebase(doc, isSnapshot));
  });
  return conversations;
};
