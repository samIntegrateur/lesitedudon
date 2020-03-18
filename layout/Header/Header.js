import React from 'react';
import Container from '../Container/Container';
import classes from './Header.module.css';
import Link from 'next/link';
import {connect} from 'react-redux';

const Header = (props) => (
  <header className={classes.header}>
    <Container>
      <div className={classes.header__row}>
        <div className={classes.header__logo}>
          <Link href="/">
            <a className={classes.linkTitle}>
              <h1>LeSiteDuDon</h1>
            </a>
          </Link>
        </div>
        <nav className={classes.header__nav}>
          <ul className={classes.header__navList}>
            <li className={classes.header__navListItem}>
              {props.isAuthenticated
                ? <Link href="/deconnexion"><a className={classes.header__navLink}>Déconnexion</a></Link>
                : <Link href="/connexion"><a className={classes.header__navLink}>Connexion</a></Link>
              }
            </li>
          </ul>
        </nav>
      </div>
    </Container>
  </header>
);

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Header);

