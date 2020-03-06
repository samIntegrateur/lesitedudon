import React, {Fragment} from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Container from './Container/Container';
import classes from './Layout.module.css';

const Layout = (props) => (
  <div className={classes.Layout}>
    <Header />
    <main role="main" className={classes.Main}>
      <Container>
        {props.children}
      </Container>
    </main>
    <Footer />
  </div>
);

export default Layout;
