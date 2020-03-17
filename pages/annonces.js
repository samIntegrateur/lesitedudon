import React from 'react';
import Layout from '../layout/Layout';
import OfferList from '../components/Offer/OfferList/OfferList';
import fetch from 'node-fetch';
import {API_BASE_URL} from '../shared/contants';
import {sanitizeOffers} from '../shared/utility';

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

export async function getStaticProps() {
  const res = await fetch(`${API_BASE_URL}offers.json`);
  const offers = await res.json();
  const sanitizedOffers = sanitizeOffers(offers);
  return { props: { offers: sanitizedOffers } };
}


export default Annonces;
