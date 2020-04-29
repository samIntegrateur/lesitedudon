import { fromUnixTime } from "date-fns";
import { ApiState, ApiStateActions } from "../store/types/common.type";
import { ApiTimeStamp } from "./types/dates.type";

export function updateObject<T> (
  oldObject: T,
  updatedProperties: object,
): T {
  return {
    ...oldObject,
    ...updatedProperties,
  };
}

export const updateApiState = (
  apiState: ApiState,
  apiAction: ApiStateActions,
  updatedProperties: object,
): ApiState  => {
  return updateObject(apiState, {
    [apiAction]: updateObject(apiState[apiAction], updatedProperties)
  });
};

// Sometimes it's .seconds, sometimes ._seconds
export const convertUnixTime = (
  dateToDetect: ApiTimeStamp
) => {
  let secondTime;
  if (dateToDetect.seconds) {
    secondTime = dateToDetect.seconds;
  } else if (dateToDetect._seconds) {
    secondTime = dateToDetect._seconds;
  }

  if (secondTime){
    return fromUnixTime(secondTime);
  }
  console.error('Couldn\'t find appropriate date properties, a dumb date has been provided instead');
  return new Date('1970-01-01');
};

// I wanted to avoid redundant checks, but tslint still complains after..
// maybe create an initial fake value to never have undefined ?
// export const isContextReady = (context: Partial<FirebaseContextType>, userRequired = false): boolean => {
//   if (!context) {
//     return false;
//   }
//   if (context.loading) {
//     return false;
//   }
//   if (!context.firebase) {
//     return false;
//   }
//   if (userRequired) {
//     return (!!context.user && isUserEnhanced(context.user));
//   }
//   return true;
// }
