import { ApiTimeStamp } from "./dates.type";

export interface OfferCommon {
  author: string;
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
