import firebase from "firebase";
import { Profile } from "../shared/types/profile.type";
import { Firebase } from "./firebase";

export type FirebaseOrderDir = 'asc' | 'desc' | undefined;

export interface PostOfferArgs {
  title: string;
  description: string;
  image?: string | null;
}

// Infos we add to auth user with getUserProfile
export interface UserEnhanced extends firebase.User {
  isAdmin?: boolean;
  username?: string | null;
  userProfile?: Profile;
}

export interface FirebaseContextType {
  firebase: Firebase;
  user: UserEnhanced;
  loading: boolean;
}
