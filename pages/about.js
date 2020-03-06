import Link from 'next/link';
import Layout from '../layout/Layout';

const About = () => {
  return (
    <Layout>
      <p>This is the about page</p>
      <Link href="/">Go to index page</Link>
    </Layout>
  );
};

export default About;
