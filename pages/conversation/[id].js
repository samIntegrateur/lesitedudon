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
  const [conversation, setConversation] = useState(null);
  const [convError, setConvError] = useState(null);
  const [convLoading, setConvLoading] = useState(true);
  const [offerId, setOfferId] = useState(null);
  const [offer, setOffer] = useState(false);
  const [offerLoading, setOfferLoading] = useState(true);
  const [offerError, setOfferError] = useState(false);

  const { id } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading]);

  useEffect(() => {
    let unsubscribe;
    if (user && user.username && firebase && id) {
      setConvLoading(true);
      unsubscribe = firebase.subscribeToConversation({
        conversationId: id,
        handleSnapshot: (conversationSnapshot) => {
          console.log('conversationSnapshot', conversationSnapshot);
          setConvLoading(false);
          handleConversationSnapshot(conversationSnapshot);
        },
        handleError: (error) => {
          setConvLoading(false);
          setConvError(error);
        }
      })
    }

    return () => {
      if(unsubscribe) {
        unsubscribe();
      }
    }
  }, [user, firebase, id]);

  const handleConversationSnapshot = (conversationSnapshot) => {
    setConversation(conversationSnapshot);
    const id = conversationSnapshot.offer;
    if (id !== offerId) {
      setOfferId(id);
      getOffer(id);
    }
  };

  const getOffer = (id) => {
    setOfferLoading(true);
    firebase.getOffer({offerId: id})
      .then(offer => {
        setOfferLoading(false);
        setOffer(offer);
      })
      .catch(error => {
        setOfferLoading(false);
        setOfferError(error);
      });
  };

  const dynamicTitle = `Conversation ${id} - Le site du don`;

  let display = null;

  if (loading || convLoading || offerLoading) {
    display = <Spinner />;
  } else if (convError) {
    display = (
      <>
        <p>Une erreur s'est produite, la conversation n'a pas pu être récupérée.</p>
        {convError.message ? <p className="error">{convError.message}</p> : null}
      </>
    )
  } else if (conversation) {
    display = <ConversationDetail conversation={conversation}
                                  offer={offer}
                                  offerError={offerError}
                                  user={user} />
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
