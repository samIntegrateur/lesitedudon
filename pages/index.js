import React from 'react';
import Link from 'next/link';
import Layout from '../layout/Layout';
import withAuth from '../hoc/withAuth/withAuth';

const Index = (props) => {

  console.log('props', props);
  return (

    <Layout
      title="Le site du don"
      description="Site de dons d'objets. Offrez les objets qui vous encombrent et récupérez gratuitement ceux des autres">

      {/*<p>*/}
      {/*  Suis-je connecté ?*/}
      {/*  <strong>*/}
      {/*    {props.isAuthenticated ? 'oui' : 'non'}*/}
      {/*  </strong>*/}
      {/*</p>*/}

      {props.isAuthenticated &&
        <div>
          <h2>Créer une annonce</h2>
          <Link href="/creer-une-annonce"><a>Créer une annonce</a></Link>
        </div>
      }

      <h2>Les dernières annonces</h2>
      {/*<ul>*/}
      {/*  <li>*/}
      {/*    todo*/}
      {/*  </li>*/}
      {/*</ul>*/}
      <Link href="/annonces"><a>Voir plus</a></Link>
    </Layout>
  );
};

export default withAuth(Index);
