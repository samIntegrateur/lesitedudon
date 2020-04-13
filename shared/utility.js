import FireStoreParser from 'firestore-parser';
import {fromUnixTime} from "date-fns";

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

// Sometimes it's .seconds, sometimes ._seconds
export const convertUnixTime = (dateToDetect) => {
  let secondTime;
  if (dateToDetect.seconds) {
    secondTime = dateToDetect.seconds;
  } else if (dateToDetect._seconds) {
    secondTime = dateToDetect._seconds;
  }
  return fromUnixTime(secondTime);
};
