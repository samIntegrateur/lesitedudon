import {updateObject, updateApiState} from '../../shared/utility';
import { OfferApiState, OfferState } from "../types/offer.type";
import { commonApiStateItemInitial } from "../utils";
import { OfferActionTypes } from "../actions/actionTypes";
import { Reducer } from "redux";
import { OfferAction } from "../actions";

const initialState: OfferState = {
  offers: [],
  currentOffer: null,
  loading: false,
  apiState: {
    [OfferApiState.FETCH_OFFERS]: {
      ...commonApiStateItemInitial,
    },
    [OfferApiState.FETCH_OFFER]: {
      ...commonApiStateItemInitial,
    },
    [OfferApiState.POST_OFFER]: {
      ...commonApiStateItemInitial,
      postId: null,
    },
  },
};

const offerReducer: Reducer<OfferState, OfferAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case OfferActionTypes.FETCH_OFFERS_START: {
      return updateObject(state, {
        loading: true,
        apiState: updateApiState(state.apiState, OfferApiState.FETCH_OFFERS, {
          error: null,
        })
      });
    }
    case OfferActionTypes.FETCH_OFFERS_SUCCESS: {
      return updateObject(state, {
        offers: action.offers,
        loading: false,
      });
    }
    case OfferActionTypes.FETCH_OFFERS_FAIL: {
      return updateObject(state, {
        loading: false,
        apiState: updateApiState(state.apiState, OfferApiState.FETCH_OFFERS, {
          error: action.error,
        })
      });
    }

    case OfferActionTypes.FETCH_OFFER_START: {
      return updateObject(state, {
        loading: true,
        currentOffer: null,
        apiState: updateApiState(state.apiState, OfferApiState.FETCH_OFFER, {
          error: null,
        })
      });
    }
    case OfferActionTypes.FETCH_OFFER_SUCCESS: {
      return updateObject(state, {
        currentOffer: action.offer,
        loading: false,
      });
    }
    case OfferActionTypes.FETCH_OFFER_FAIL: {
      return updateObject(state, {
        loading: false,
        apiState: updateApiState(state.apiState, OfferApiState.FETCH_OFFER, {
          error: action.error,
        })
      });
    }

    case OfferActionTypes.POST_OFFER_START: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, OfferApiState.POST_OFFER, {
          error: null,
          success: false,
          loading: true,
        })
      });
    }
    case OfferActionTypes.POST_OFFER_SUCCESS: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, OfferApiState.POST_OFFER, {
          success: true,
          postId: action.id,
          loading: false,
        })
      });
    }
    case OfferActionTypes.POST_OFFER_FAIL: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, OfferApiState.POST_OFFER, {
          error: action.error,
          loading: false,
        })
      });
    }
    case OfferActionTypes.POST_OFFER_CLEAR: {
      return updateObject(state, {
        apiState: updateApiState(state.apiState, OfferApiState.POST_OFFER, {
          error: null,
          success: false,
          postId: null,
        })
      });
    }
    default:
      return state;
  }
};

export default offerReducer;
