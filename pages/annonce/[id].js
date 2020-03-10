import Link from 'next/link';
import { useRouter } from 'next/router'
import Layout from '../../layout/Layout';

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);

  const dynamicTitle = `Annonce ${id} - Le site du don`;
  return (
    <Layout
      title={dynamicTitle}
      description={dynamicTitle}>

      <h1>Annonce {id}</h1>

      <Link href="/"><a>Retour</a></Link>
    </Layout>
  );
};

export default Index;
