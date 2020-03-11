import Link from 'next/link';
import Layout from '../layout/Layout';

const Index = () => {
  return (
    <Layout
      title="Le site du don"
      description="Site de dons d'objets. Offrez les objets qui vous encombrent et récupérez gratuitement ceux des autres">

      <h2>Créer une annonce</h2>
      <Link href="/creer-une-annonce"><a>Créer une annonce</a></Link>

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

export default Index;
