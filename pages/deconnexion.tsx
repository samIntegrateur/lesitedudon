import React, {useContext, useEffect, useState} from 'react';
import Layout from '../layout/Layout';
import Button from '../components/UI/Button/Button';
import Spinner from '../components/UI/Spinner/Spinner';
import FirebaseContext from '../firebase/context';

const Deconnexion: React.FC = () => {

  let display = null;

  const {firebase, user} = useContext(FirebaseContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  let isMounted = true;

  useEffect(() => {
    return (): void => {
      isMounted = false;
    }
  }, []);

  useEffect(() => {
    if (firebase) {
      setIsLoading(true);
      firebase.logout()
        .then(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }).catch(e => {
          if (isMounted) {
            setIsLoading(false);
            setError(e);
          }
        });
    }
  }, [firebase]);




  if (!!user || isLoading) {
    display = <Spinner />;
  } else {

    if (error) {
      display = (
        <p>{error.message}</p>
      );
    } else {
      display = (
        <div>
          <p>Vous avez bien été déconnecté&nbsp;!</p>
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
