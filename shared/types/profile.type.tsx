import { ApiTimeStamp } from "./dates.type";

export interface Profile {
  username?: string;
  userId: string;
  newMessages: number;
  offersNumber: number;
  dateCreated: ApiTimeStamp | Date;
  dateUpdated: ApiTimeStamp | Date;
}
