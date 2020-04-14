import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import OfferList from '../OfferList/OfferList';
import Button from '../../UI/Button/Button';

const OfferListManager = () => {

  const {firebase} = useContext(FirebaseContext);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState({
    initial: true,
    more: false,
  });
  const [isLastPage, setIsLastPage] = useState(false);
  const [startAfter, setStartAfter] = useState(null);
  const limit = 10;
  const orderBy = {
    value: 'dateCreated',
    dir: 'desc',
  };

  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    }
  }, []);


  useEffect(() => {
    if (firebase) {
      getOffers();
    }
  }, [firebase]);

  const getOffers = (more = false) => {
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
        setStartAfter(lastItem);
        setOffers(prevState => [...prevState, ...newOffers]);
      }
    }).catch((e) => {
      setIsLoading(prevState => ({...prevState, [loader]: false}));
    });
  };

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
        <Button type="button" style="secondary" clicked={() => getOffers(true)}>
          Afficher plus d'offres
        </Button>
        }
      </div>

    </div>
  );
};

export default OfferListManager;
