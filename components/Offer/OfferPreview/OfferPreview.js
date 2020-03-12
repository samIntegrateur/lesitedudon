import React from 'react';
import Moment from 'react-moment';
import classes from './OfferPreview.module.css';

const OfferPreview = ({offer}) => {

  const idImg = Math.floor(Math.random() * 100);

  return (
    <article className={classes.offerPreview}>
      <figure className={classes.offerPreview_media}>
        <img className={classes.offerPreview_img}
          src={`https://picsum.photos/id/${idImg}/600`} alt="Aperçu objet"/>
      </figure>
      <div className={classes.offerPreview_content}>
        <h2 className={classes.offerPreview_title}>{offer.title}</h2>
        <Moment className={classes.offerPreview_date} format="DD/MM/YYYY - HH:mm">
          {offer.creationDate}
        </Moment>
      </div>
    </article>
  );
};

export default OfferPreview;
