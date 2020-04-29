import { Action } from "redux";
import { OfferActionTypes } from "./actionTypes";
import { Offer } from "../../shared/types/offer.type";
import { Firebase } from "../../firebase/firebase";
import { CustomFormData } from "../../shared/types/form.type";

// FETCH OFFERS

export const fetchOffers = (
): Action<OfferActionTypes.FETCH_OFFERS> => {
  return {
    type: OfferActionTypes.FETCH_OFFERS,
  }
};

export const fetchOffersStart = (
): Action<OfferActionTypes.FETCH_OFFERS_START> => {
  return {
    type: OfferActionTypes.FETCH_OFFERS_START,
  }
};

interface FetchOffersSuccessAction extends Action<OfferActionTypes.FETCH_OFFERS_SUCCESS> {
  offers: Offer[];
}
export const fetchOffersSuccess = (
  offers: Offer[],
): FetchOffersSuccessAction => {
  return {
    type: OfferActionTypes.FETCH_OFFERS_SUCCESS,
    offers,
  }
};

interface FetchOffersFailAction extends Action<OfferActionTypes.FETCH_OFFERS_FAIL> {
  error: Error;
}
export const fetchOffersFail = (
  error: Error,
): FetchOffersFailAction => {
  return {
    type: OfferActionTypes.FETCH_OFFERS_FAIL,
    error,
  }
};

// FETCH OFFER

interface FetchOfferAction extends Action<OfferActionTypes.FETCH_OFFER> {
  id: string;
}
export const fetchOffer = (
  id: string,
): FetchOfferAction => {
  return {
    type: OfferActionTypes.FETCH_OFFER,
    id,
  }
};

export const fetchOfferStart = (
): Action<OfferActionTypes.FETCH_OFFER_START> => {
  return {
    type: OfferActionTypes.FETCH_OFFER_START,
  }
};

interface FetchOfferSuccessAction extends Action<OfferActionTypes.FETCH_OFFER_SUCCESS> {
  offer: Offer;
}
export const fetchOfferSuccess = (
  offer: Offer,
): FetchOfferSuccessAction => {
  return {
    type: OfferActionTypes.FETCH_OFFER_SUCCESS,
    offer,
  }
};

interface FetchOfferFailAction extends Action<OfferActionTypes.FETCH_OFFER_FAIL> {
  error: Error;
}
export const fetchOfferFail = (
  error: Error,
): FetchOfferFailAction => {
  return {
    type: OfferActionTypes.FETCH_OFFER_FAIL,
    error,
  }
};

// POST OFFER

interface PostOfferAction extends Action<OfferActionTypes.POST_OFFER> {
  offer: CustomFormData;
  firebase: Firebase;
}
export const postOffer = (
  offer: CustomFormData,
  firebase: Firebase
): PostOfferAction => {
  return {
    type: OfferActionTypes.POST_OFFER,
    offer,
    firebase,
  }
};

export const postOfferStart = (
): Action<OfferActionTypes.POST_OFFER_START> => {
  return {
    type: OfferActionTypes.POST_OFFER_START,
  }
};

interface PostOfferSuccessAction extends Action<OfferActionTypes.POST_OFFER_SUCCESS> {
  id: string;
}
export const postOfferSuccess = (
  id: string,
): PostOfferSuccessAction => {
  return {
    type: OfferActionTypes.POST_OFFER_SUCCESS,
    id,
  }
};

interface PostOfferFailAction extends Action<OfferActionTypes.POST_OFFER_FAIL> {
  error: Error;
}
export const postOfferFail = (
  error: Error
): PostOfferFailAction => {
  return {
    type: OfferActionTypes.POST_OFFER_FAIL,
    error,
  }
};

export const postOfferClear = (
): Action<OfferActionTypes.POST_OFFER_CLEAR> => {
  return {
    type: OfferActionTypes.POST_OFFER_CLEAR,
  }
};

export type OfferAction =
  | Action<OfferActionTypes.FETCH_OFFERS>
  | Action<OfferActionTypes.FETCH_OFFERS_START>
  | FetchOffersSuccessAction
  | FetchOffersFailAction
  | FetchOfferAction
  | Action<OfferActionTypes.FETCH_OFFER_START>
  | FetchOfferSuccessAction
  | FetchOfferFailAction
  | PostOfferAction
  | Action<OfferActionTypes.POST_OFFER_START>
  | PostOfferSuccessAction
  | PostOfferFailAction
  | Action<OfferActionTypes.POST_OFFER_CLEAR>
;
