import React from 'react';
import Layout from '../layout/Layout';
import OfferList from '../components/Offer/OfferList/OfferList';
import fetch from 'node-fetch';
import {FIRESTORE_BASE_URL} from '../shared/contants';
import {sanitizeOffersFromRest} from '../shared/sanitize';

const Annonces = (props) => {
  return (
    <Layout
      title="Les annonces d'objets gratuits - Le site du don"
      description="Toutes les annonces de dons proposés par nos généreux membres">
      <h1>Les annonces de dons</h1>
      <OfferList offers={props.offers} />
    </Layout>
  );
};

export async function getStaticProps(context) {
  const res = await fetch(`${FIRESTORE_BASE_URL}databases/(default)/documents/offers`);
  const offers = await res.json();
  const sanitizedOffers = sanitizeOffersFromRest(offers);

  return {
    props: {offers: sanitizedOffers},
  }
}

export default Annonces;
