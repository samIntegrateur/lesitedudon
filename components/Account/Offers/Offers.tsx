import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import OfferList from '../../Offer/OfferList/OfferList';
import Spinner from '../../UI/Spinner/Spinner';
import { Offer } from "../../../shared/types/offer.type";
import * as firebase from 'firebase';

const Offers: React.FC = () => {

  // ------------------ Context ------------------
  const { user, firebase } = useContext(FirebaseContext);

  // ------------------ State ------------------
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ------------------ Effects ------------------
  // todo : handle errors
  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe;

    if (user && user.username && firebase) {
      setIsLoading(true);
      unsubscribe = firebase.subscribeToUserOffers({
        username: user.username,
        snapshot: (offersSnapshot) => {
          setIsLoading(false);
          setOffers(offersSnapshot);
        }
      })
    }

    return (): void => {
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
