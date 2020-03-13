import Link from 'next/link';
import { useRouter } from 'next/router'
import Layout from '../../layout/Layout';
import OfferDetail from '../../components/Offer/OfferDetail/OfferDetail';
import React from 'react';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;

  const dynamicTitle = `Annonce ${id} - Le site du don`;
  return (
    <Layout
      title={dynamicTitle}
      description={dynamicTitle}>

      <OfferDetail id={id} />

      <a onClick={router.back}>Retour</a>
    </Layout>
  );
};

export default Index;
