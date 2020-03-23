import React, {useEffect} from 'react';
import Layout from '../layout/Layout';
import OfferForm from '../components/Offer/OfferForm/OfferForm';
import withAuth from '../hoc/withAuth/withAuth';
import { useRouter } from 'next/router';

// "Private" page : if first check has been made and isAuthenticated is false, redirect
// todo: add server side guard : https://sergiodxa.com/articles/redirects-in-next-the-good-way/
const CreerUneAnnonce = (props) => {
  const router = useRouter();
  const {firstCheck, isAuthenticated} = props;

  useEffect(() => {
    if (firstCheck && !isAuthenticated) {
      router.replace('/connexion');
    }
  }, [firstCheck, isAuthenticated]);

  return (
    <Layout
      title="Créer une annonce - Le site du don"
      description="Créez une nouvelle annonce pour donner gratuitement un objet">

      { props.isAuthenticated &&
        <div>
          <h1>Créer une annonce</h1>
          <OfferForm />
        </div>
      }
    </Layout>
  );
};

// export default withAuth(CreerUneAnnonce);
export default CreerUneAnnonce;
