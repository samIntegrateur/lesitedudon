import firebaseConfig from "./config";

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

  async login({email, password}) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async register({username, email, password}) {
    // 1 create user
    await this.auth.createUserWithEmailAndPassword(email, password);

    // todo catch error for this step

    // 2 create a new corresponding publicProfiles item
    const createProfileCallable = this.functions.httpsCallable('createPublicProfile');
    return createProfileCallable({
      username
    })
  }

  async logout() {
    await this.auth.signOut();
  }

  getUserProfile({userId, onSnapshot}) {
    return this.db.collection('publicProfiles')
      .where('userId', '==', userId)
      .limit(1)
      .onSnapshot(onSnapshot);
  }

  async getOffers({}) {
    return this.db.collection('offers').get();
  }
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
