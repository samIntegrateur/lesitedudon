import {useEffect, useState} from "react"
import getFirebaseInstance from "./firebase"
import loadFirebaseDependencies from "./loadFirebaseDependencies"

function useAuth() {
  const [user, setUser] = useState(null);
  const [firebase, setFirebase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    let publicProfileUnsubscribe;

    loadFirebaseDependencies.then(app => {
      const firebaseInstance = getFirebaseInstance(app);
      setFirebase(firebaseInstance);

      setLoading(true);
      unsubscribe = firebaseInstance.auth.onAuthStateChanged(userResult => {
        console.log('onAuthStateChanged');
        if (userResult) {
          console.log('userResult', userResult);
          publicProfileUnsubscribe = firebaseInstance.getUserProfile({
            userId: userResult.uid,
            onSnapshot: r => {
              setLoading(true);
              firebaseInstance.auth.currentUser.getIdTokenResult(true)
                .then(token => {
                  setUser({
                    ...userResult,
                    // custom claims provided in our cloud functions
                    isAdmin: token.claims.admin,
                    username: r.empty ? null : r.docs[0].id
                  });
                  setLoading(false);
                }).catch(e => {
                  setLoading(false);
                });

            }
          })

        } else {
          setLoading(false);
          setUser(null);
        }
      })
    });

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }

      if (publicProfileUnsubscribe) {
        publicProfileUnsubscribe()
      }
    }
  }, []);

  return {user, firebase, loading}
}

export default useAuth;
