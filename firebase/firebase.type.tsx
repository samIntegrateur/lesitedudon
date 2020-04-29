import firebase from "firebase";
import { Profile } from "../shared/types/profile.type";
import { Firebase } from "./firebase";
import { undef } from "@redux-saga/is";

export type FirebaseOrderDir = 'asc' | 'desc' | undefined;

export interface PostOfferArgs {
  title: string;
  description: string;
  image?: string | null;
}

// Infos we add to auth user with getUserProfile
export interface UserEnhanced extends firebase.User {
  isAdmin: boolean;
  username: string;
  userProfile: Profile;
}

export interface FirebaseContextType {
  firebase: Firebase;
  user: UserEnhanced;
  loading: boolean;
}

// We often want to check if user is valid / ready
export const isUserEnhanced = (
  toBeDetermined: UserEnhanced | undefined,
): toBeDetermined is UserEnhanced => {

  if (!toBeDetermined) {
    return false;
  }

  const user = toBeDetermined as UserEnhanced;
  return (
    !!(user).uid
    && !!(user).username
    && !!(user).userProfile
  )
}

