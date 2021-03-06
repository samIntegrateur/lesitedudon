import { useRouter } from 'next/router'
import Layout from '../../layout/Layout';
import React from 'react';
import {FIRESTORE_BASE_URL} from '../../shared/constants';
import {getOffersIds, sanitizeOfferFromRest} from '../../shared/sanitize';
import OfferConversationHandler from '../../components/Offer/OfferConversationHandler/OfferConversationHandler';
import { Offer } from "../../shared/types/offer.type";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";

interface IndexProps {
  id: string;
  offer: Offer;
}
const Index: React.FC<IndexProps> = (props) => {
  const router = useRouter();
  // const { id } = router.query;

  const dynamicTitle = `Annonce ${props.id} - Le site du don`;
  return (
    <Layout
      title={dynamicTitle}
      description={dynamicTitle}>

      <OfferConversationHandler offerId={props.id} offer={props.offer} />

      <a onClick={router.back}>Retour</a>
    </Layout>
  );
};


export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${FIRESTORE_BASE_URL}databases/(default)/documents/offers`);
  const offers = await res.json();
  const offersIds = getOffersIds(offers);

  // Get the paths we want to pre-render based on posts
  const paths = offersIds.map(offersId => ({
    params: {id: offersId}
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.co
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  if (context && context.params && context.params.id) {

    const res = await fetch(`${FIRESTORE_BASE_URL}databases/(default)/documents/offers/${context.params.id}`);
    const offer = await res.json();
    const sanitizedOffer = sanitizeOfferFromRest(offer);
    return { props: { offer: sanitizedOffer, id: context.params.id } };
  }
  throw new Error('Invalid getStaticProps context');
}

export default Index;
