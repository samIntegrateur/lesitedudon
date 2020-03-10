import React, {useEffect, useState} from 'react';
import axios from '../../../shared/axios';
import Link from 'next/link';

const OfferList = () => {

  let offersDisplay = null;

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const result = await axios.get('/offers.json');
    let sanitizedOffersData = [];
    for (let key in result.data) {
      sanitizedOffersData.push({
        ...result.data[key],
        id: key,
      });
    }
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
