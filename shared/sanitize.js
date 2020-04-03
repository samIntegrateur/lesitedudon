import {fromUnixTime} from 'date-fns';

// There are differences between what api rest returns and what firebase functions does
import FireStoreParser from 'firestore-parser';

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
    const itemData = doc.data();
    offers.push({
      ...itemData,
      id: doc.id,
      // Here we receive the whole author reference, but we just want the id
      author: itemData.author.id,
      // Convert date timestamp
      dateCreated: fromUnixTime(itemData.dateCreated.seconds),
      dateUpdated: fromUnixTime(itemData.dateUpdated.seconds),
    });
  });
  return offers;
};
