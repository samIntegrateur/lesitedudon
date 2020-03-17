import React from 'react';
import classes from './OfferDetail.module.css';
import moment from 'moment';

const OfferDetail = (props) => {

  let offerDisplay = null;

  if (props.offer) {
    offerDisplay = (
      <article className={classes.offer}>
        <section className={classes.offer__medias}>
          <figure className={classes.offer__media}>
            <img className={classes.offer__img}
                 src={`https://picsum.photos/800/600`} alt="Aperçu objet" />
          </figure>
        </section>
        <div className={classes.offer__content}>
          <header className={classes.offer__header}>
            <h1 className={classes.offer__title}>
              {props.offer.title}
            </h1>
            <time dateTime={moment(props.offer.creationDate).format('YYYY-MM-DDThh:mm')}>
              {moment(props.offer.creationDate).format('DD/MM/YYYY - HH:mm')}
            </time>
          </header>
          <div className="offer__desc">
            {props.offer.description}
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
