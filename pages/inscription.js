import React from 'react';
import Layout from '../layout/Layout';
import InscriptionForm from '../components/Authentification/InscriptionForm/InscriptionForm';

const Inscription = () => {
  return (

    <Layout
      title="Inscription - Le site du don"
      description="Inscription - Le site du don">

      <InscriptionForm />

    </Layout>
  );
};

export default Inscription;
