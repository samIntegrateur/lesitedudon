
// There are differences between what api rest returns and what firebase functions does
import FireStoreParser from 'firestore-parser';
import {convertUnixTime} from './utility';

export const sanitizeOffersFromRest = (data) => {

  const parsedData = FireStoreParser(data);

  const sanitizedOffersData = [];
  parsedData.documents.forEach((document) => {
    sanitizedOffersData.push(
      sanitizeOfferFromRest(document, false)
    );
  });
  return sanitizedOffersData;
};

export const sanitizeOfferFromRest = (offer, parse = true) => {
  const parsedOffer = parse ? FireStoreParser(offer) : offer;

  return {
    id: extractIdFromPath(parsedOffer.name),
    ...parsedOffer.fields,
    author: extractIdFromPath(parsedOffer.fields.author),
  };
};

// ex get 123 from "lorem/ipsum/123";
export const extractIdFromPath = (path) => {
  const pathArray = path.split("/");
  const id = pathArray[pathArray.length - 1];
  return id;
};

// Get id list for getStaticPaths
export const getOffersIds = (data) => {
  const offersId = [];
  data.documents.forEach((document) => {
    const id = extractIdFromPath(document.name);
    offersId.push(id);
  });
  return offersId;
};

// For firebase.js functions
export const sanitizeOffersFromFirebase = (snapshot) => {
  const offers = [];
  if (snapshot.empty) {
    return offers;
  }

  snapshot.forEach(doc => {
    offers.push(sanitizeOfferFromFirebase(doc));
  });
  return offers;
};

export const sanitizeOfferFromFirebase = (offer) => {
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

export const sanitizeConversationsFromFirebase = (datas, isSnapshot = true) => {
  const conversations = [];
  if (isSnapshot && datas.empty) {
    return conversations;
  }

  datas.forEach(doc => {
    conversations.push(sanitizeConversationFromFirebase(doc, isSnapshot));
  });
  return conversations;
};

export const sanitizeConversationFromFirebase = (conversation, isSnapshot = true) => {
  const itemData = isSnapshot ? conversation.data() : conversation.datas;

  return {
    ...itemData,
    id: conversation.id,
    dateCreated: convertUnixTime(itemData.dateCreated),
    dateUpdated: convertUnixTime(itemData.dateUpdated),
    messages:  itemData.messages
      ? itemData.messages.map(message => {
          return {
            ...message,
            timestamp: convertUnixTime(message.timestamp)
          }
        })
      : []
  }
};
