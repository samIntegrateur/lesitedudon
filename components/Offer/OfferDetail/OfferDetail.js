import React, {useEffect, useState} from 'react';
import classes from './OfferDetail.module.css';
// import Moment from 'react-moment';
import axios from '../../../shared/axios';
import Spinner from '../../UI/Spinner/Spinner';
import moment from 'moment';
const OfferDetail = (props) => {

  let offerDisplay = null;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await axios.get(`/offers/${props.id}.json`);
    setIsLoading(false);
    setData(result.data);
    console.log('result.data', result.data);
  };

  useEffect(() => {
    if (props.id) {
      fetchData();
    }
  }, [props.id]);

  if (isLoading) {
    offerDisplay = <Spinner />
  } else {
    if (data) {
      offerDisplay = (
        <article className={classes.offer}>
          <section className={classes.offer__medias}>
            <figure className={classes.offer__media}>
              <img className={classes.offerPreview_img}
                   src={`https://picsum.photos/800/600`} alt="Aperçu objet" />
            </figure>
          </section>
          <div className={classes.offer__content}>
            <header className={classes.offer__header}>
              <h1 className={classes.offer__title}>
                {data.title}
              </h1>
              <time dateTime={moment(data.creationDate).format('YYYY-MM-DDThh:mm')}>
                {moment(data.creationDate).format('DD/MM/YYYY - HH:mm')}
              </time>
              {/*This causes an error*/}
              {/*<Moment className={classes.offer__date} format="DD/MM/YYYY - HH:mm">*/}
              {/*  {data.creationDate}*/}
              {/*</Moment>*/}
            </header>
            <div className="offer__desc">
              {data.description}
            </div>
          </div>
        </article>
      );
    } else {
      offerDisplay = (
        <p><strong>L'annonce n'a pas pu être récupérée.</strong></p>
      )
    }
  }

  return offerDisplay;
};

export default OfferDetail;
