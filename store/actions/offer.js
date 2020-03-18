import * as actionTypes from './actionTypes';

// FETCH OFFERS
export const fetchOffers = () => {
  return {
    type: actionTypes.FETCH_OFFERS,
  }
};

export const fetchOffersStart = () => {
  return {
    type: actionTypes.FETCH_OFFERS_START,
  }
};

export const fetchOffersSuccess = (offers) => {
  return {
    type: actionTypes.FETCH_OFFERS_SUCCESS,
    offers,
  }
};

export const fetchOffersFail = (error) => {
  return {
    type: actionTypes.FETCH_OFFERS_FAIL,
    error,
  }
};

// FETCH OFFER
export const fetchOffer = (id) => {
  return {
    type: actionTypes.FETCH_OFFER,
    id,
  }
};

export const fetchOfferStart = () => {
  return {
    type: actionTypes.FETCH_OFFER_START,
  }
};

export const fetchOfferSuccess = (offer) => {
  return {
    type: actionTypes.FETCH_OFFER_SUCCESS,
    offer,
  }
};

export const fetchOfferFail = (error) => {
  return {
    type: actionTypes.FETCH_OFFER_FAIL,
    error,
  }
};

// POST OFFER
export const postOffer = (offer, token) => {
  return {
    type: actionTypes.POST_OFFER,
    offer,
    token,
  }
};

export const postOfferStart = () => {
  return {
    type: actionTypes.POST_OFFER_START,
  }
};

export const postOfferSuccess = () => {
  return {
    type: actionTypes.POST_OFFER_SUCCESS,
  }
};

export const postOfferFail = (error) => {
  console.log('postOfferFail', error);
  return {
    type: actionTypes.POST_OFFER_FAIL,
    error,
  }
};

export const postOfferClear = () => {
  return {
    type: actionTypes.POST_OFFER_CLEAR,
  }
};
