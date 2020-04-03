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
        setLoading(true);
        // Here we have auth infos,
        // Now we want to add datas from userProfile
        if (userResult) {
          publicProfileUnsubscribe = firebaseInstance.getUserProfile({
            userId: userResult.uid,
            onSnapshot: userSnapshot => {
              const userDatas = [];
              userSnapshot.forEach(doc => {
                userDatas.push(doc.data());
              });
              firebaseInstance.auth.currentUser.getIdTokenResult(true)
                .then(token => {
                  setUser({
                    ...userResult,
                    // custom claims provided in our cloud functions
                    isAdmin: token.claims.admin,
                    username: userSnapshot.empty ? null : userSnapshot.docs[0].id,
                    userProfile: userDatas[0] || null
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
