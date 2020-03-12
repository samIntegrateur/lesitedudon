import React, {useEffect, useState} from 'react';
import axios from '../../../shared/axios';
import Link from 'next/link';
import OfferPreview from '../OfferPreview/OfferPreview';
import classes from './OfferList.module.css';
import Spinner from '../../UI/Spinner/Spinner';

const OfferList = () => {

  let offersDisplay = null;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    // todo: we can't sort desc, so we must take what we want (eventually with limitToLast) then sort in front
    const result = await axios.get('/offers.json?orderBy="creationDate"');
    let sanitizedOffersData = [];
    for (let key in result.data) {
      sanitizedOffersData.push({
        ...result.data[key],
        id: key,
      });
    }
    sanitizedOffersData.sort((a, b) => (a.creationDate < b.creationDate) ? 1 : -1);
    console.log('sanitizedOffersData', sanitizedOffersData);
    setIsLoading(false);
    setData(sanitizedOffersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    offersDisplay = <Spinner />
  } else {
    if (data.length) {
      offersDisplay = (
        <ul className={classes.offerList}>
          {data.map(offer => (
            <li key={offer.id} className={classes.offerList__item}>
              <Link href={`/annonce/${offer.id}`}>
                <a title="Voir l'annonce" className={classes.offerList__itemLink}>
                  <OfferPreview offer={offer} />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      );
    } else {
      offersDisplay = <p>Il n'y pas d'annonce actuellement</p>;
    }
  }

  return (
    <div>
      {offersDisplay}
    </div>
  );
};

export default OfferList;
