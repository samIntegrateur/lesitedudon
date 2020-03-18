import React from 'react';
import Layout from '../layout/Layout';
import ConnexionForm from '../components/Connexion/ConnexionForm/ConnexionForm';
import withAuth from '../hoc/withAuth/withAuth';

const Connexion = () => {
  return (

    <Layout
      title="Connexion - Le site du don"
      description="Connexion - Le site du don">

      <ConnexionForm />

    </Layout>
  );
};

export default withAuth(Connexion);
