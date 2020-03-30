import React from 'react';
import classes from './OfferPreview.module.css';
import DateTime from '../../UI/DateTime/DateTime';

const OfferPreview = ({offer}) => {

  const imageSrc = offer.thumbUrl || offer.imageUrl || null;

  return (
    <article className={classes.offerPreview}>
      {!!imageSrc &&
        <figure className={classes.offerPreview_media}>
          <img className={classes.offerPreview_img}
               src={imageSrc} alt="Aperçu objet" />
        </figure>
      }
      <div className={classes.offerPreview_content}>
        <h2 className={classes.offerPreview_title}>{offer.title}</h2>
        <DateTime date={offer.updateTime} />
      </div>
    </article>
  );
};

export default OfferPreview;
