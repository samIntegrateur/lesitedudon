import React from 'react';
import Link from 'next/link';
import OfferPreview from '../OfferPreview/OfferPreview';
import classes from './OfferList.module.css';
import Button from '../../UI/Button/Button';

const OfferList = (props) => {

  let offersDisplay = null;

  if (props.offers) {
    if (props.offers.length > 0) {
      offersDisplay = (
        <ul className={classes.offerList}>
          {props.offers.map(offer => (
            <li key={offer.id} className={classes.offerList__item}>
              <Link href={`/annonce/[id]`} as={`/annonce/${offer.id}`}>
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
  } else {
    offersDisplay = (
      <div>
        <p>
          Une erreur s'est produite, les annonces n'ont pas pu être récupérées.
          Veuillez nous excuser pour le désagrément.
        </p>
        <Button type="a"
                style="default"
                href="/">
          Retourner à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div>
      {offersDisplay}
    </div>
  );
};

export default OfferList;
