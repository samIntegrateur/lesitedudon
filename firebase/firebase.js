import firebaseConfig from "./config";
import {sanitizeOffersFromFirebase} from '../shared/sanitize';

class Firebase {
  constructor(app) {
    if(!firebaseInstance) {
      app.initializeApp(firebaseConfig);

      this.auth = app.auth();
      this.db = app.firestore();
      this.functions = app.functions();
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
