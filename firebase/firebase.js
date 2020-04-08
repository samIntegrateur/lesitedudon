import firebaseConfig from "./config";
import {sanitizeOfferFromFirebase, sanitizeOffersFromFirebase} from '../shared/sanitize';

class Firebase {
  constructor(app) {
    if(!firebaseInstance) {
      const fireApp = app.initializeApp(firebaseConfig);

      this.auth = app.auth();
      this.db = app.firestore();
      this.functions = fireApp.functions('europe-west1');
      this.storage = app.storage();
    }
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

  checkConversation = async (args) => {
    const checkConversationCallable = this.functions.httpsCallable('checkConversation');
    return checkConversationCallable(args);
  };

  // withOffer false: we just return the id, true, we get the full offer
  getConversation = async ({conversationId, withOffer = true}) => {
    const getConversationCallable = this.functions.httpsCallable('getConversation');
    const conversationResult = await getConversationCallable({conversationId});

    console.log('result', conversationResult);

    return new Promise(async (resolve, reject) => {
      if (conversationResult.error) {
        return reject(conversationResult);
      }

      if (!withOffer) {
        return resolve(conversationResult);
      }

      const offerResult = await this.getOffer({offerId: conversationResult.data.offer});
      console.log('offerResult', offerResult);
      if (offerResult.error) {
        console.warn(`Offer with id ${conversationResult.data.offer} for conversation ${conversationId} couldn't be found.`);
        return resolve(conversationResult);
      }
      const conversationWithOffer = {
        data: {
          ...conversationResult.data,
          offer: offerResult,
        }
      };

      console.log('conversationWithOffer', conversationWithOffer);
      return resolve(conversationWithOffer);
    });
  };

  postConversation = async (args) => {
    const postConversationCallable = this.functions.httpsCallable('postConversation');
    return postConversationCallable(args);
  };

}

let firebaseInstance;

function getFirebaseInstance(app) {
  console.log('firebaseInstance', firebaseInstance);
  console.log('app', app);
  if (!firebaseInstance && app) {
    firebaseInstance = new Firebase(app);
    return firebaseInstance;
  } else if (firebaseInstance) {
    return firebaseInstance
  } else{
    return null;
  }
}

export default getFirebaseInstance;
