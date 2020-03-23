import React from 'react';
import classes from './OfferPreview.module.css';
import DateTime from '../../UI/DateTime/DateTime';

const OfferPreview = ({offer}) => {

  return (
    <article className={classes.offerPreview}>
      <figure className={classes.offerPreview_media}>
        <img className={classes.offerPreview_img}
          src={offer.imageUrl} alt="Aperçu objet"/>
      </figure>
      <div className={classes.offerPreview_content}>
        <h2 className={classes.offerPreview_title}>{offer.title}</h2>
        <DateTime date={offer.updateTime} />
      </div>
    </article>
  );
};

export default OfferPreview;
