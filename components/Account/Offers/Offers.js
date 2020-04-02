import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import OfferList from '../../Offer/OfferList/OfferList';
import Spinner from '../../UI/Spinner/Spinner';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const {user, firebase} = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('effect');
    let unsubscribe;
    if (user && user.username && firebase) {
      setIsLoading(true);
      console.log('user', user);
      console.log('user.username', user.username);
      unsubscribe = firebase.subscribeToUserOffers({
        username: user.username,
        snapshot: (offersSnapshot) => {
          console.log('offersSnapshot', offersSnapshot);
          setIsLoading(false);
          setOffers(offersSnapshot);
        }
      })
    }

    return () => {
      if(unsubscribe) {
        unsubscribe();
      }
    }
  }, [user, firebase]);

  return (
    <div>
      {isLoading ? <Spinner/> : <OfferList offers={offers} />}
    </div>
  );
};

export default Offers;
