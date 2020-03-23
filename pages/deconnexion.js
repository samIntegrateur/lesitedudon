import React, {useContext, useEffect, useState} from 'react';
import Layout from '../layout/Layout';
import Button from '../components/UI/Button/Button';
import Spinner from '../components/UI/Spinner/Spinner';
import FirebaseContext from '../firebase/context';

const Deconnexion = () => {

  let display = null;

  const {firebase, user} = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false;
    }
  }, []);

  useEffect(() => {
    if (!!firebase) {
      setIsLoading(true);
      firebase.logout()
        .then(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }).catch(e => {
          if (isMounted) {
            setIsLoading(false);
            setHasError(e);
          }
        });
    }
  }, [firebase]);




  if (!!user || isLoading) {
    display = <Spinner />;
  } else {

    if (hasError) {
      display = (
        <p>{hasError.message}</p>
      );
    } else {
      display = (
        <div>
          <p>Vous avez bien été déconnecté !</p>
          <Button type="a"
                  style="default"
                  href="/">
            Retourner à l'accueil
          </Button>
        </div>
      );
    }
  }

  return (
    <Layout
      title="Déconnexion - Le site du don"
      description="Déconnexion - Le site du don">
     {display}
    </Layout>
  );
};

export default Deconnexion;
