import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../../layout/Layout';
import ConversationDetail from '../../components/Conversation/ConversationDetail/ConversationDetail';
import FirebaseContext from '../../firebase/context';
import Spinner from '../../components/UI/Spinner/Spinner';

// do ssr ?
const Index = (props) => {
  const router = useRouter();
  const {loading, user, firebase} = useContext(FirebaseContext);

  const { id } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading]);


  const dynamicTitle = `Conversation ${id} - Le site du don`;

  let display = null;

  if (loading) {
    display = <Spinner />;
  } else {
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
