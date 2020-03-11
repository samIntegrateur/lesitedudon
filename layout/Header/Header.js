import React from 'react';
import Container from '../Container/Container';
import classes from './Header.module.css';
import Link from 'next/link';

const Header = (props) => (
  <header className={classes.header}>
    <Container>
      <Link href="/">
        <a className={classes.linkTitle}>
          <h1>LeSiteDuDon</h1>
        </a>
      </Link>
    </Container>
  </header>
);

export default Header;
