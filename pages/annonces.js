import React from 'react';
import Layout from '../layout/Layout';
import OfferList from '../components/Offer/OfferList/OfferList';

const Annonces = () => {
  return (
    <Layout
      title="Les annonces d'objets gratuits - Le site du don"
      description="Toutes les annonces de dons proposés par nos généreux membres">
      <h1>Les annonces de dons</h1>
      <OfferList />
    </Layout>
  );
};

export default Annonces;
