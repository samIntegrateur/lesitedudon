import { ApiTimeStamp } from "./dates.type";
import { Profile } from "./profile.type";

export interface OfferCommon {
  id?: string;
  author: string | Profile;
  title: string;
  description: string;
  imageUrl?: string;
  thumbUrl?: string;
}

export interface OfferFromApi extends OfferCommon {
  dateCreated: ApiTimeStamp;
  dateUpdated: ApiTimeStamp;
}

export interface Offer extends OfferCommon {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
}

// after parse but before individual sanitize
export interface OfferWithFields {
  name: string;
  fields: OfferFromApi;
}
