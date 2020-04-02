import React, {useContext, useEffect} from 'react';
import Layout from '../layout/Layout';
import OfferForm from '../components/Offer/OfferForm/OfferForm';
import { useRouter } from 'next/router';
import FirebaseContext from '../firebase/context';
import Spinner from '../components/UI/Spinner/Spinner';

// "Private" page : if not authenticated, redirect
// todo: add server side guard : https://sergiodxa.com/articles/redirects-in-next-the-good-way/
const CreerUneAnnonce = () => {
  const router = useRouter();
  const {loading, user} = useContext(FirebaseContext);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading]);

  return (
    <Layout
      title="Créer une annonce - Le site du don"
      description="Créez une nouvelle annonce pour donner gratuitement un objet">

      {loading &&
        <Spinner />
      }

      { !!user &&
        <div>
          <h1>Créer une annonce</h1>
          <OfferForm user={user} />
        </div>
      }
    </Layout>
  );
};

export default CreerUneAnnonce;
