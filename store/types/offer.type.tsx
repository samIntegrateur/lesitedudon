import { ApiStateItem } from "./common.type";
import { Offer } from "../../shared/types/offer.type";

export interface PostOfferState extends ApiStateItem {
  postId: string | null;
}

export enum OfferApiState {
  FETCH_OFFERS = 'fetchOffers',
  FETCH_OFFER = 'fetchOffer',
  POST_OFFER = 'postOffer',
}

export interface OfferState {
  offers: Offer[] | null;
  currentOffer: Offer | null;
  loading: boolean;
  apiState: {
    [OfferApiState.FETCH_OFFERS]: ApiStateItem;
    [OfferApiState.FETCH_OFFER]: ApiStateItem;
    [OfferApiState.POST_OFFER]: PostOfferState;
  };
}
