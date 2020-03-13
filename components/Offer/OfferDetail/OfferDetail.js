import React, {useEffect} from 'react';
import classes from './OfferDetail.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import moment from 'moment';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';
import Button from '../../UI/Button/Button';

const OfferDetail = (props) => {

  let offerDisplay = null;

  const {id, loading, error, offer, onFetchOffer} = props;

  useEffect(() => {
    if (id) {
      onFetchOffer(id);
    }
  }, [id, onFetchOffer]);

  if (loading) {
    offerDisplay = <Spinner />
  } else {
    if (error) {
      offerDisplay = (
        <div>
          <p>
            Une erreur s'est produite, l'annonce n'a pas pu être récupérée.
          </p>
          <Button type="a"
                  style="default"
                  href="/">
            Retourner à l'accueil
          </Button>
        </div>
      );
    } else if (offer) {
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
                {offer.title}
              </h1>
              <time dateTime={moment(offer.creationDate).format('YYYY-MM-DDThh:mm')}>
                {moment(offer.creationDate).format('DD/MM/YYYY - HH:mm')}
              </time>
            </header>
            <div className="offer__desc">
              {offer.description}
            </div>
          </div>
        </article>
      );
    }
  }

  return offerDisplay;
};

const mapStateToProps = state => {
  return {
    offer: state.offer.currentOffer,
    loading: state.offer.loading,
    error: state.offer.apiState.fetchOffer.error,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOffer: (id) => dispatch(actions.fetchOffer(id)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OfferDetail);
