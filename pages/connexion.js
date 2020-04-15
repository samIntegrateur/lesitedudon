import React from 'react';
import Layout from '../layout/Layout';
import ConnexionForm from '../components/Authentification/ConnexionForm/ConnexionForm';

const Connexion = () => {
  return (

    <Layout
      containerSmall
      title="Connexion - Le site du don"
      description="Connexion - Le site du don">

      <ConnexionForm />

    </Layout>
  );
};

export default Connexion;
