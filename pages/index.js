import Link from 'next/link';
import Layout from '../layout/Layout';

const Index = () => {
  return (
    <Layout>
      <p>Hello Next.js</p>
      <Link href="/about">Go to about page</Link>
    </Layout>
  );
};

export default Index;
