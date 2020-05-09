import React, { useContext, useEffect, useState } from "react";
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import OfferList from '../OfferList/OfferList';
import Button from '../../UI/Button/Button';
import { Offer } from "../../../shared/types/offer.type";
import * as firebase from "firebase";
import { OrderBy } from "../../../shared/types/common.type";

const OfferListManager: React.FC = () => {

  // ------------------ Context ------------------
  const { firebase } = useContext(FirebaseContext);

  // ------------------ State ------------------
  const [offers, setOffers] = useState<Offer[]>([]);
  const [
    isLoading,
    setIsLoading,
  ] = useState<{initial: boolean; more: boolean}>({
    initial: true,
    more: false,
  });

  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const [
    startAfter,
    setStartAfter,
  ] = useState<firebase.firestore.DocumentData | null>(null);

  // ------------------ Local vars ------------------
  const limit = 10;
  const orderBy: OrderBy = {
    value: 'dateCreated',
    dir: 'desc',
  };

  let isMounted = true;

  const getOffers = (more = false): void => {

    if (firebase) {
      const loader = more ? 'more' : 'initial';
      setIsLoading(prevState => ({...prevState, [loader]: true}));
      firebase.getOffers({
        limit, orderBy, startAfter
      }).then(({newOffers = [], lastItem}) => {
        if (isMounted) {
          setIsLoading(prevState => ({...prevState, [loader]: false}));
          if (!lastItem || newOffers.length < limit) {
            setIsLastPage(true);
          }
          setStartAfter(lastItem ? lastItem : null);
          setOffers(prevState => [...prevState, ...newOffers]);
        }
      }).catch((e) => {
        setIsLoading(prevState => ({...prevState, [loader]: false}));
      });
    }

  };

  // ------------------ Effects ------------------
  useEffect(() => {
    return (): void => {
      isMounted = false;
    }
  }, []);


  useEffect(() => {
      getOffers();
  }, [firebase]);

  return (
    <div>

      <div className="part-big">
        { isLoading.initial ? <Spinner/> : <OfferList offers={offers} /> }
      </div>

      {isLoading.more &&
        <Spinner />
      }
      <div style={{textAlign: 'center'}}>
        {!isLoading.initial && !isLoading.more && !isLastPage &&
        <Button type="button" style="secondary"
                clicked={(): void => getOffers(true)}>
          Afficher plus d'offres
        </Button>
        }
      </div>

    </div>
  );
};

export default OfferListManager;
