import FireStoreParser from 'firestore-parser';

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const updateApiState = (apiState, apiAction, updatedProperties) => {
  return updateObject(apiState, {
    [apiAction]: updateObject(apiState[apiAction], updatedProperties)
  });
};

export const sanitizeOffers = (data) => {
  // let sanitizedOffersData = [];
  // for (let key in data) {
  //   sanitizedOffersData.push({
  //     ...data[key],
  //     id: key,
  //   });
  // }
  // sanitizedOffersData.sort((a, b) => (a.creationDate < b.creationDate) ? 1 : -1);
  // return sanitizedOffersData;

  const parsedData = FireStoreParser(data);

  const sanitizedOffersData = [];
  parsedData.documents.forEach((document) => {
    sanitizedOffersData.push(
      sanitizeOffer(document, false)
    );
  });
  return sanitizedOffersData;
};

export const sanitizeOffer = (offer, parse = true) => {
  const parsedOffer = parse ? FireStoreParser(offer) : offer;

  return {
    id: extractIdFromPath(parsedOffer.name),
    ...parsedOffer.fields,
    author: extractIdFromPath(parsedOffer.fields.author),
    createTime: parsedOffer.createTime,
    updateTime: parsedOffer.updateTime,
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
