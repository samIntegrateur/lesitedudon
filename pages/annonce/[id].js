import Link from 'next/link';
import { useRouter } from 'next/router'
import Layout from '../../layout/Layout';
import OfferDetail from '../../components/Offer/OfferDetail/OfferDetail';
import React from 'react';
import {API_BASE_URL} from '../../shared/contants';
// Why standard fetch doesn't work ?
import fetch from 'node-fetch';
import withAuth from '../../hoc/withAuth/withAuth';

const Index = (props) => {
  const router = useRouter();
  // const { id } = router.query;

  const dynamicTitle = `Annonce ${props.id} - Le site du don`;
  return (
    <Layout
      title={dynamicTitle}
      description={dynamicTitle}>

      {console.log(props)}
      <OfferDetail id={props.id} offer={props.offer} />

      <a onClick={router.back}>Retour</a>
    </Layout>
  );
};


// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch(`${API_BASE_URL}offers.json`);
  const posts = await res.json();
  const postsIds = [];
  for (let key in posts) {
    postsIds.push(key);
  }

  // Get the paths we want to pre-render based on posts
  const paths = postsIds.map(postId => ({
    params: {id: postId}
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log('getStaticProps');
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`${API_BASE_URL}offers/${params.id}.json`);
  const offer = await res.json();

  // Pass post data to the page via props
  return { props: { offer, id: params.id } };
}

export default withAuth(Index);
