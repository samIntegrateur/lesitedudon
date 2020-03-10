import React from 'react';
import Container from '../Container/Container';
import classes from './Footer.module.css';

const Footer = (props) => (
  <footer className={classes.footer}>
    <Container>
      <p>
        LeSiteDuDon © 2020
      </p>
    </Container>
  </footer>
);

export default Footer;
