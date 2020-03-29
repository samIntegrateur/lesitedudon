import React from 'react';
import classes from './OfferDetail.module.css';
import DateTime from '../../UI/DateTime/DateTime';

const OfferDetail = (props) => {

  let offerDisplay = null;
  const {offer} = props;

  if (offer) {
    offerDisplay = (
      <article className={classes.offer}>
        <header className={classes.offer__header}>
          <h1 className={classes.offer__title}>
            {offer.title}
          </h1>
        </header>
        {!!offer.imageUrl &&
          <section className={classes.offer__medias}>
            <figure className={classes.offer__media}>
              <img className={classes.offer__img}
                 src={offer.imageUrl} alt="Aperçu objet"/>
            </figure>
          </section>
        }
        <div className={classes.offer__content}>
          <div className={classes.offer__infos}>
            <DateTime date={offer.updateTime} />
            <span>Offert par <strong>{offer.author}</strong></span>
          </div>

          <div className={classes.offer__desc}>
            {offer.description}
          </div>
        </div>
      </article>
    );
  } else {
    offerDisplay = <p>
      Une erreur s'est produite, l'annonce n'a pas pu être récupérée.<br/>
      Veuillez nous excuser pour le désagrément.
    </p>
  }

  return offerDisplay;
};

export default OfferDetail;
