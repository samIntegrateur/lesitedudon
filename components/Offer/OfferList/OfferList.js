import React, {useEffect} from 'react';
import Link from 'next/link';
import OfferPreview from '../OfferPreview/OfferPreview';
import classes from './OfferList.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions/'
import {connect} from 'react-redux';
import Button from '../../UI/Button/Button';

const OfferList = (props) => {

  let offersDisplay = null;

  const {loading, error, offers, onFetchOffers} = props;

  useEffect(() => {
    onFetchOffers();
  },[onFetchOffers]);

  if (loading) {
    offersDisplay = <Spinner />
  } else {
    if (error) {
      offersDisplay = (
        <div>
          <p>
            Une erreur s'est produite, les annonces n'ont pas pu être récupérées.
          </p>
          <Button type="a"
                  style="default"
                  href="/">
            Retourner à l'accueil
          </Button>
        </div>
      );
    } else if (offers) {
      if (offers.length > 0) {
        offersDisplay = (
          <ul className={classes.offerList}>
            {offers.map(offer => (
              <li key={offer.id} className={classes.offerList__item}>
                <Link href={`/annonce/${offer.id}`}>
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
    }
  }

  return (
    <div>
      {offersDisplay}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    offers: state.offer.offers,
    loading: state.offer.loading,
    error: state.offer.apiState.fetchOffers.error,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOffers: () => dispatch(actions.fetchOffers()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OfferList);
