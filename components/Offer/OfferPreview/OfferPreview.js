import React from 'react';
import classes from './OfferPreview.module.css';

const OfferPreview = ({offer}) => {

  return (
    <article className={classes.offerPreview}>
      <figure className={classes.offerPreview_media}>
        <img className={classes.offerPreview_img}
          src={`https://picsum.photos/id/10/600`} alt="Aperçu objet"/>
      </figure>
      <div className={classes.offerPreview_content}>
        <h2 className={classes.offerPreview_title}>{offer.title}</h2>
          {offer.creationDate}
      </div>
    </article>
  );
};

export default OfferPreview;
