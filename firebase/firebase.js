import firebaseConfig from "./config";
import {
  sanitizeConversationFromFirebase, sanitizeConversationsFromFirebase,
  sanitizeOfferFromFirebase,
  sanitizeOffersFromFirebase
} from '../shared/sanitize';

class Firebase {
  constructor(app) {
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

  login = async ({email, password}) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  register = async({username, email, password}) => {
    // 1 create user
    await this.auth.createUserWithEmailAndPassword(email, password);

    // todo catch error for this step

    // 2 create a new corresponding publicProfiles item
    const createProfileCallable = this.functions.httpsCallable('createPublicProfile');
    return createProfileCallable({
      username
    })
  };

  logout = async () => {
    await this.auth.signOut();
  };

  // todo: put this in cloud fn to ensure userId fits the auth user
  getUserProfile = ({userId, onSnapshot}) => {
    return this.db.collection('publicProfiles')
      .where('userId', '==', userId)
      .limit(1)
      .onSnapshot(onSnapshot);
  };

  getOffers = async ({limit = 10, orderBy = {value: 'dateCreated', dir: 'desc'}, startAfter = null}) => {
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

  subscribeToUserOffers = ({username, snapshot}) => {
    const userRef = this.db.collection('publicProfiles').doc(username);
    return this.db.collection('offers')
      .where('author', '==', userRef)
      .onSnapshot(snap => {
        const sanitizedOffers = sanitizeOffersFromFirebase(snap);
        snapshot(sanitizedOffers);
      });
  };

  getOffer = async ({offerId}) => {
    const query = this.db.collection('offers').doc(offerId);
    return await query.get()
      .then(snapshot => {
        let offer;

        if (!snapshot.empty) {
          offer = sanitizeOfferFromFirebase(snapshot);
        }
        return offer;
      });
  };

  postOffer = async ({title, description, image = null}) => {
    const datas = {
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
  getUserConversations = async ({withOffer = true}) => {
    const getUserConversationsCallable = this.functions.httpsCallable('getUserConversations');
    const conversations = await getUserConversationsCallable({});
    const sanitizedConversations = sanitizeConversationsFromFirebase(conversations.data, false);

    if (!withOffer) {
      return {data: sanitizedConversations};
    }

    const mapLoop = async () => {
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

  subscribeToConversation = ({conversationId, handleSnapshot, handleError}) => {
    let query = this.db.collection('conversations').doc(conversationId);
    return query
      .onSnapshot(snap => {
        if (!snap.exists) {
          handleError({message: 'La conversation est introuvable.'});
        } else {
          const conversation = sanitizeConversationFromFirebase(snap);
          handleSnapshot(conversation);
        }
      }, (error) => {
        handleError(error);
      })
  };

  markConversationRead = async ({conversationId}) => {
    const markConversationReadCallable = this.functions.httpsCallable('markConversationRead');
    return markConversationReadCallable({conversationId});
  };

  checkConversation = async (args) => {
    const checkConversationCallable = this.functions.httpsCallable('checkConversation');
    return checkConversationCallable(args);
  };

  postConversation = async (args) => {
    const postConversationCallable = this.functions.httpsCallable('postConversation');
    return postConversationCallable(args);
  };

  sendMessage = async (args) => {
    const sendMessageCallable = this.functions.httpsCallable('sendMessage');
    return sendMessageCallable(args);
  };

}

let firebaseInstance;

function getFirebaseInstance(app) {
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
