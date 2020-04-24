import React, {useContext} from 'react';
import Container from '../Container/Container';
import classes from './Header.module.css';
import Link from 'next/link';
import {FirebaseContext} from '../../firebase';
import Spinner from '../../components/UI/Spinner/Spinner';
import Badge from '../../components/UI/Badge/Badge';

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

  let badgeDisplay;
  if (user && user.userProfile && user.userProfile.newMessages && user.userProfile.newMessages > 0) {
    const title = `Vous avez ${user.userProfile.newMessages} ${user.userProfile.newMessages > 1 ? 'nouveaux messages' : 'nouveau message'}`;
    badgeDisplay = (
      <Badge style="secondary" super title={title}>
        {user.newMessages}
      </Badge>
    );
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
                <>
                  <li className={classes.header__navListItem}>
                    <Link href="/compte?tab=Conversations">
                      <a className={classes.header__navLink}>
                        <span>Messages</span>
                        {badgeDisplay}
                      </a>
                    </Link>
                  </li>

                  <li className={classes.header__navListItem}>
                    <Link href="/compte">
                      <a className={classes.header__navLink}>Mon compte</a>
                    </Link>
                  </li>
                </>
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

