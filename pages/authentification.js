import React from 'react';
import Layout from '../layout/Layout';
import AuthentificationForm from '../components/Authentification/AuthentificationForm/AuthentificationForm';

const Authentification = () => {
  return (

    <Layout
      title="Authentification - Le site du don"
      description="Authentification - Le site du don">

      <AuthentificationForm />

    </Layout>
  );
};

export default Authentification;
