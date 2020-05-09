import React from 'react';
import Link from 'next/link';
import OfferPreview from '../OfferPreview/OfferPreview';
import classes from './OfferList.module.css';
import Button from '../../UI/Button/Button';
import { Offer } from "../../../shared/types/offer.type";

const OfferList: React.FC<{offers: Offer[]}> = ({offers}) => {

  let offersDisplay;

  if (offers) {
    if (offers.length && offers.length > 0) {
      offersDisplay = (
        <ul className={classes.offerList}>
          {offers.map(offer => (
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
