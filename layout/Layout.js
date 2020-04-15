import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Container from './Container/Container';
import classes from './Layout.module.css';
import Head from 'next/head';

const Layout = (props) => (
  <>
    {/*Should I do something with _app.js instead ? */}
    <Head>
      <meta charSet="utf-8" key="charset" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
      <title key="title">{props.title || 'Le site du don'}</title>
      <meta name="description" content={props.description || 'Site de dons d\'objets. Offrez les objets qui vous encombrent et récupérez gratuitement ceux des autres'} />
    </Head>
    <div className={classes.layout}>
      <Header className={classes.layout__item} />
      <main role="main" className={[classes.layout__item, classes.layout__main].join(' ')}>
        <Container small={props.containerSmall}>
          {props.children}
        </Container>
      </main>
      <Footer className={classes.layout__item} />
    </div>
  </>
);

export default Layout;
