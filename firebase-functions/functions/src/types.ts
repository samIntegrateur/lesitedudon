import * as admin from 'firebase-admin';

export interface NewOffer {
  author: admin.firestore.DocumentReference;
  title: string;
  description: string;
  dateCreated: Date,
  dateUpdated: Date,
  imageUrl?: string,
}

export interface Message {
  isRead: boolean;
  message: string;
  user: string;
  timestamp: Date | string | object;
}
