import {useEffect, useState} from "react"
import getFirebaseInstance, { Firebase } from "./firebase";
import loadFirebaseDependencies from "./loadFirebaseDependencies"
import firebase from "firebase";
import { UserEnhanced } from "./firebase.type";
import { Profile } from "../shared/types/profile.type";

function useAuth() {
  const [user, setUser] = useState<UserEnhanced | undefined>();
  const [firebase, setFirebase] = useState<Firebase | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe;
    let publicProfileUnsubscribe: Function;

    loadFirebaseDependencies.then(app => {
      const firebaseInstance = getFirebaseInstance(app);

      if (firebaseInstance) {
        const firebaseValidInstance = firebaseInstance as Firebase;
        setFirebase(firebaseValidInstance);

        unsubscribe = firebaseValidInstance.auth.onAuthStateChanged(userResult => {
          setLoading(true);
          // Here we have auth infos,
          // Now we want to add datas from userProfile
          if (userResult) {
            publicProfileUnsubscribe = firebaseValidInstance.getUserProfile({
              userId: userResult.uid,
              onSnapshot: userSnapshot => {
                const userDatas: Profile[] = [];
                userSnapshot.forEach(doc => {
                  userDatas.push(doc.data() as Profile);
                });
                if (firebaseValidInstance.auth && firebaseValidInstance.auth.currentUser) {
                  firebaseValidInstance.auth.currentUser.getIdTokenResult(true)
                    .then(token => {

                      if (userDatas[0] && userSnapshot.docs[0]) {
                        setUser({
                          ...userResult,
                          // custom claims provided in our cloud functions
                          isAdmin: token.claims.admin,
                          username: userSnapshot.docs[0].id,
                          userProfile: userDatas[0],
                        });
                      }
                      setLoading(false);

                    }).catch(e => {
                    setLoading(false);
                  });
                }

              }
            })

          } else {
            setLoading(false);
            setUser(undefined);
          }
        })
      }
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
