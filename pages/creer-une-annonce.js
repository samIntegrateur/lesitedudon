import Layout from '../layout/Layout';
import OfferForm from '../components/Offer/OfferForm/OfferForm';

const CreerUneAnnonce = () => {

  return (
    <Layout
      title="Créer une annonce - Le site du don"
      description="Créez une nouvelle annonce pour donner gratuitement un objet">

      <h1>Créer une annonce</h1>
      <OfferForm />
    </Layout>
  );
};

export default CreerUneAnnonce;
