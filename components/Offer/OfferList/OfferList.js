import React, {useEffect, useState} from 'react';
import axios from '../../../shared/axios';
import Link from 'next/link';
import Moment from 'react-moment';

const OfferList = () => {

  let offersDisplay = null;

  const [data, setData] = useState([]);

  const fetchData = async () => {
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
    setData(sanitizedOffersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data.length) {
    offersDisplay = (
      <ul>
        {data.map(offer => (
          <li key={offer.id}>
            <h2>{offer.title}</h2>
            <Moment format="DD/MM/YYYY - HH:mm">{offer.creationDate}</Moment>
            <p>
              {offer.description}
            </p>
            <Link href={`/annonce/${offer.id}`}>
              <a>Voir l'annonce</a>
            </Link>
          </li>
        ))}
      </ul>
    );
  } else {
    offersDisplay = <p>Il n'y pas d'annonce actuellement</p>;
  }

  return (
    <div>
      {offersDisplay}
    </div>
  );
};

export default OfferList;
