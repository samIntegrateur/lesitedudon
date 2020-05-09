import React from 'react';
import classes from './OfferPreview.module.css';
import DateTime from '../../UI/DateTime/DateTime';
import { Offer } from "../../../shared/types/offer.type";

interface OfferPreviewProps {
  offer: Offer;
  small?: boolean;
}
const OfferPreview: React.FC<OfferPreviewProps> = (
  {
    offer,
    small = false,
  }
) => {

  const imageSrc = offer.thumbUrl || offer.imageUrl || null;

  const classList = [classes.offerPreview];
  if (small) {
    classList.push(classes.offerPreviewSmall);
  }

  return (
    <article className={classList.join(' ')}>
      {!!imageSrc &&
        <figure className={classes.offerPreview_media}>
          <img className={classes.offerPreview_img}
               src={imageSrc} alt="Aperçu objet" />
        </figure>
      }
      <div className={classes.offerPreview_content}>
        <h2 className={classes.offerPreview_title}>{offer.title}</h2>
        <DateTime date={offer.dateCreated} />
      </div>
    </article>
  );
};

export default OfferPreview;
