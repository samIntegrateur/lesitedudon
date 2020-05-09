import React, {useContext} from 'react';
import Link from 'next/link';
import Layout from '../layout/Layout';

import FirebaseContext from '../firebase/context';

const Index: React.FC = () => {
  const { user } = useContext(FirebaseContext);

  return (

    <Layout
      title="Le site du don"
      description="Site de dons d'objets. Offrez les objets qui vous encombrent et récupérez gratuitement ceux des autres">

      {!!user &&
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

// export default withAuth(Index);
export default Index;
