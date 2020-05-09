import React, {useContext, useEffect, useState} from 'react';
import Layout from '../../layout/Layout';
import {useRouter} from 'next/router';
import FirebaseContext from '../../firebase/context';
import AccountTab from '../../components/Account/AccountTab/AccountTab';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';


const Index: React.FC = () => {
  const router = useRouter();
  const {loading, user} = useContext(FirebaseContext);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading, router]);

  return (
    <Layout
      title="Mon compte - Le site du don"
      description="Mon compte - Le site du don">

      {loading &&
        <Spinner />
      }

      {!!user &&
        <div>
          <h1>Mon compte</h1>

          <div className="part-big">
            <Button type="a" style="secondary" href='/creer-une-annonce'>
              Créer une annonce
            </Button>
          </div>

          <AccountTab />
        </div>
      }

    </Layout>
  );
};

export default Index;
