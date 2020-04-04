import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../../layout/Layout';
import ConversationDetail from '../../components/Conversation/ConversationDetail/ConversationDetail';
import FirebaseContext from '../../firebase/context';
import Spinner from '../../components/UI/Spinner/Spinner';

// do ssr ?
const Index = (props) => {
  const router = useRouter();
  const {loading, user} = useContext(FirebaseContext);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading]);

  const { id } = router.query;

  const dynamicTitle = `Conversation ${id} - Le site du don`;
  return (
    <Layout
      title={dynamicTitle}
      description={dynamicTitle}>

      {loading &&
        <Spinner />
      }

      {user && conversation &&
        <ConversationDetail id={id} conversation={conversation} />
      }

      <a onClick={router.back}>Retour</a>
    </Layout>
  );
};

export default Index;
