import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../../layout/Layout';
import ConversationDetail from '../../components/Conversation/ConversationDetail/ConversationDetail';
import FirebaseContext from '../../firebase/context';
import Spinner from '../../components/UI/Spinner/Spinner';

// do ssr ?
const Index: React.FC = () => {
  const router = useRouter();
  const {loading, user, firebase} = useContext(FirebaseContext);

  const { id } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading, router]);


  const dynamicTitle = `Conversation ${id} - Le site du don`;

  let display;

  if (loading) {
    display = <Spinner />;
  } else if (typeof(id) === 'string' && user && firebase) {
    display = <ConversationDetail id={id}
                                  user={user}
                                  firebase={firebase} />
  }

  return (
    <Layout
      title={dynamicTitle}
      description={dynamicTitle}>

      <div className="part-big">
        {display}
      </div>

      <a onClick={router.back}>Retour</a>
    </Layout>
  );
};

export default Index;
