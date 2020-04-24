import firebaseConfig from "./config";
import {
  sanitizeConversationFromFirebase, sanitizeConversationsFromFirebase,
  sanitizeOfferFromFirebase,
  sanitizeOffersFromFirebase
} from '../shared/sanitize';
import * as firebase from 'firebase';
import { Offer } from "../shared/types/offer.type";
import { FirebaseOrderDir, PostOfferArgs } from "./firebase.type";
import { Conversation } from "../shared/types/conversation.type";

// Not sure about this, but constructor has errors otherwise...
interface InitializeAppFn {
  (options: Record<string, any>, name?: string): firebase.app.App;
}

interface FirebaseApp extends firebase.app.App {
  apps: firebase.app.App[];
  initializeApp: InitializeAppFn;
}

export class Firebase {

  auth: firebase.auth.Auth;
  db: firebase.firestore.Firestore;
  storage: firebase.storage.Storage;
  functions: firebase.functions.Functions;

  constructor(app: FirebaseApp) {
    // Fix, on hot reload, everything seems reset (including firebaseInstance)
    // but apps still contains old instance, and initialize would create error
    if (!app.apps.length) {
      const fireApp = app.initializeApp(firebaseConfig);
      this.functions = fireApp.functions('europe-west1');
    } else {
      this.functions = app.functions()
    }

    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }

  login = async ({email, password}: {
    email: string;
    password: string;
  }): Promise<firebase.auth.UserCredential> => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  // todo: replace firebase.functions.HttpsCallableResult as it's precisly defined in our functions
  register = async({username, email, password}: {
    username: string;
    email: string;
    password: string;
  }): Promise<firebase.functions.HttpsCallableResult> => {
    // 1 create user
    await this.auth.createUserWithEmailAndPassword(email, password);

    // todo catch error for this step

    // 2 create a new corresponding publicProfiles item
    const createProfileCallable = this.functions.httpsCallable('createPublicProfile');
    return createProfileCallable({
      username
    })
  };

  logout = async (): Promise<void> => {
    await this.auth.signOut();
  };

  // todo: put this in cloud fn to ensure userId fits the auth user
  getUserProfile = ({userId, onSnapshot}: {
    userId: string;
    onSnapshot: (snapshot: firebase.firestore.QuerySnapshot) => void;
  }): () => void => {
    return this.db.collection('publicProfiles')
      .where('userId', '==', userId)
      .limit(1)
      .onSnapshot(onSnapshot);
  };

  getOffers = async (
    { limit = 10,
      orderBy = {value: 'dateCreated', dir: 'desc'},
      startAfter = null
    }: {
      limit: number;
      orderBy: {
        value: string;
        dir: FirebaseOrderDir;
      };
      startAfter: firebase.firestore.DocumentData | null;
    }): Promise<{
      newOffers: Offer[] | undefined;
      lastItem: firebase.firestore.DocumentData | undefined;
    }> => {

    let query;
    console.log('startAfter', startAfter);

    if (startAfter) {
      query = this.db.collection('offers')
        .orderBy(orderBy.value, orderBy.dir)
        .startAfter(startAfter)
        .limit(limit);
    } else {
      query = this.db.collection('offers')
        .orderBy(orderBy.value, orderBy.dir)
        .limit(limit);
    }

    return await query.get()
      .then(snapshot => {
        let newOffers;
        let lastItem;

        if (!snapshot.empty) {
          newOffers = sanitizeOffersFromFirebase(snapshot);
          // We store the last Item returned as the starting doc for next "page"
          // https://firebase.google.com/docs/firestore/query-data/query-cursors
          lastItem = snapshot.docs[snapshot.docs.length-1];
        }
        return {newOffers, lastItem};
      });
  };

  subscribeToUserOffers = ({username, snapshot}: {
    username: string;
    snapshot: (snapshot: Offer[]) => void;
  }): () => void => {

    const userRef = this.db.collection('publicProfiles').doc(username);
    return this.db.collection('offers')
      .where('author', '==', userRef)
      .onSnapshot(snap => {
        const sanitizedOffers = sanitizeOffersFromFirebase(snap);
        snapshot(sanitizedOffers);
      });
  };

  getOffer = async ({offerId}: {
    offerId: string;
  }): Promise<Offer> => {

    const query = this.db.collection('offers').doc(offerId);
    return await query.get()
      .then(snapshot => {
        let offer;

        if (snapshot.exists) {
          offer = sanitizeOfferFromFirebase(snapshot);
        }
        return offer;
      });
  };

  postOffer = async ({title, description, image = null}: PostOfferArgs
  ): Promise<firebase.functions.HttpsCallableResult> => {
    const datas: PostOfferArgs = {
      title,
      description,
    };
    if (image) {
      datas.image = image;
    }
    const postOfferCallable = this.functions.httpsCallable('postOffer');
    return postOfferCallable(datas);
  };

  // can be slow, get offers in a second time with local loader ? or in BE ?
  // in both case we can have multiple references for the same (if we created an offer) so avoid getting it multiple times
  getUserConversations = async ({withOffer = true}: {
    withOffer: boolean;
  }): Promise<{ data: Conversation[] }> => {
    const getUserConversationsCallable = this.functions.httpsCallable('getUserConversations');
    const conversations = await getUserConversationsCallable({});
    const sanitizedConversations = sanitizeConversationsFromFirebase(conversations.data, false);

    if (!withOffer) {
      return {data: sanitizedConversations};
    }

    const mapLoop = async (
    ): Promise< { data: Conversation[]} > => {

      const conversationsWithOffer = sanitizedConversations.map(async conversation => {
        const offerResult = await this.getOffer({offerId: conversation.offer});
        return {
          ...conversation,
          offer: offerResult
        }
      });

      const result = await Promise.all(conversationsWithOffer);
      return {data: result};
    };

    return mapLoop();

  };

  subscribeToConversation = ({conversationId, handleSnapshot, handleError}: {
    conversationId: string;
    handleSnapshot: (snapshot: Conversation) => void;
    handleError: (error: Error) => void;
  }): () => void => {

    const query = this.db.collection('conversations').doc(conversationId);
    return query
      .onSnapshot(snap => {
        if (!snap.exists) {
          handleError({name: 'not-founded', message: 'La conversation est introuvable.'});
        } else {
          const conversation = sanitizeConversationFromFirebase(snap);
          handleSnapshot(conversation);
        }
      }, (error) => {
        handleError(error);
      })
  };

  markConversationRead = async ({conversationId}: {
    conversationId: string;
  }): Promise<firebase.functions.HttpsCallableResult> => {

    const markConversationReadCallable = this.functions.httpsCallable('markConversationRead');
    return markConversationReadCallable({conversationId});
  };

  checkConversation = async (
    conversation: Conversation
  ): Promise<firebase.functions.HttpsCallableResult> => {

    const checkConversationCallable = this.functions.httpsCallable('checkConversation');
    return checkConversationCallable(conversation);
  };

  postConversation = async (
    conversation: Conversation
  ): Promise<{data: string}> => {

    const postConversationCallable = this.functions.httpsCallable('postConversation');
    return postConversationCallable(conversation);
  };

  sendMessage = async (args: {
    message: string;
    conversationId: string;
  }): Promise<firebase.functions.HttpsCallableResult> => {

    const sendMessageCallable = this.functions.httpsCallable('sendMessage');
    return sendMessageCallable(args);
  };

}

let firebaseInstance: Firebase;

function getFirebaseInstance(app: FirebaseApp): Firebase | null {
  if (!firebaseInstance && app) {
    firebaseInstance = new Firebase(app);
    return firebaseInstance;
  } else if (firebaseInstance) {
    return firebaseInstance
  } else {
    return null;
  }
}

export default getFirebaseInstance;
