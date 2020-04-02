import React, {useContext} from 'react';
import Container from '../Container/Container';
import classes from './Header.module.css';
import Link from 'next/link';
import {FirebaseContext} from '../../firebase';
import Spinner from '../../components/UI/Spinner/Spinner';

const Header = () => {

  const { user, loading } = useContext(FirebaseContext);

  let display = null;

  if (loading) {
    display = (
      <Spinner small primary />
    );
  } else {
    if (!!user && !!user.username) {
      display = (
        <>
          <span>Bonjour {user.username}</span><br />
          <Link href="/deconnexion"><a className={classes.header__navLink}>Déconnexion</a></Link>
        </>
      );
    } else {
      display = (
        <Link href="/connexion"><a className={classes.header__navLink}>Connexion</a></Link>
      );
    }
  }

  return (
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
          {/* todo: make a nav component and less ugly */}
          <nav className={classes.header__nav}>
            <ul className={classes.header__navList}>

              {!!user &&
                <li className={classes.header__navListItem}>
                  <Link href="/compte">
                    <a className={classes.header__navLink}>Mon compte</a>
                  </Link>
                </li>
              }

              <li className={classes.header__navListItem}>
                {display}
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;

