import * as actionTypes from '../actions/actionTypes';
import {updateObject, updateApiState} from '../../shared/utility';

const API_STATE_ACTION = {
  fetchOffers: 'fetchOffers',
  fetchOffer: 'fetchOffer',
  postOffer: 'postOffer',
};

const initialState = {
  offers: [],
  currentOffer: null,
  loading: false,
  apiState: {
    fetchOffers: {
      error: null,
    },
    fetchOffer: {
      error: null,
    },
    postOffer: {
      error: null,
      success: false,
    },
  },
};


const fetchOffersStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.fetchOffers, {
      error: null,
    })
  });
};

const fetchOffersSuccess = (state, action) => {
  return updateObject(state, {
    offers: action.offers,
    loading: false,
  });
};

const fetchOffersFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.fetchOffers, {
      error: action.error,
    })
  });
};


const fetchOfferStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    currentOffer: null,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.fetchOffer, {
      error: null,
    })
  });
};

const fetchOfferSuccess = (state, action) => {
  return updateObject(state, {
    currentOffer: action.offer,
    loading: false,
  });
};

const fetchOfferFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.fetchOffer, {
      error: action.error,
    })
  });
};


const postOfferStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.postOffer, {
      error: null,
      success: false,
    })
  });
};

const postOfferSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.postOffer, {
      success: true,
    })
  });
};

const postOfferFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    apiState: updateApiState(state.apiState, API_STATE_ACTION.postOffer, {
      error: action.error,
    })
  });
};

const postOfferClear = (state, action) => {
  return updateObject(state, {
    apiState: updateApiState(state.apiState, 'postOffer', {
      error: null,
      success: false,
    })
  });
};

const offerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_OFFERS_START: return fetchOffersStart(state, action);
    case actionTypes.FETCH_OFFERS_SUCCESS: return fetchOffersSuccess(state, action);
    case actionTypes.FETCH_OFFERS_FAIL: return fetchOffersFail(state, action);

    case actionTypes.FETCH_OFFER_START: return fetchOfferStart(state, action);
    case actionTypes.FETCH_OFFER_SUCCESS: return fetchOfferSuccess(state, action);
    case actionTypes.FETCH_OFFER_FAIL: return fetchOfferFail(state, action);

    case actionTypes.POST_OFFER_START: return postOfferStart(state, action);
    case actionTypes.POST_OFFER_SUCCESS: return postOfferSuccess(state, action);
    case actionTypes.POST_OFFER_FAIL: return postOfferFail(state, action);
    case actionTypes.POST_OFFER_CLEAR: return postOfferClear(state, action);
    default:
      return state;
  }
};

export default offerReducer;
