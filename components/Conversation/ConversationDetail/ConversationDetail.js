import React, {useEffect, useState} from 'react';
import classes from './ConversationDetail.module.css';
import OfferPreview from '../../Offer/OfferPreview/OfferPreview';
import Link from 'next/link';
import ConversationFrame from './ConversationFrame/ConversationFrame';
import ConversationForm from './ConversationForm/ConversationForm';
import Spinner from '../../UI/Spinner/Spinner';

const ConversationDetail = ({id, user, firebase}) => {

  const [conversation, setConversation] = useState(null);
  const [convError, setConvError] = useState(null);
  const [convLoading, setConvLoading] = useState(true);
  const [offerId, setOfferId] = useState(null);
  const [offer, setOffer] = useState(false);
  const [offerLoading, setOfferLoading] = useState(true);
  const [offerError, setOfferError] = useState(false);

  const [me, setMe] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [isMyOffer, setIsMyOffer] = useState(null);

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

  useEffect(() => {
    if (user && user.username && conversation && conversation.askerUser && conversation.receiverUser) {
      setIdentities();
    }
  }, [user, conversation, setMe, setOtherUser, setIsMyOffer]);

  const handleConversationSnapshot = (conversationSnapshot) => {
    checkUnreadMessages(conversationSnapshot.unreadMessages);
    setConversation(conversationSnapshot);
    const id = conversationSnapshot.offer;
    if (id !== offerId) {
      setOfferId(id);
      getOffer(id);
    }
  };

  const checkUnreadMessages = (unreadMessages) => {
    // if new unread messages send markConversationRead
    if (unreadMessages[user.username] > 0) {
      try {
        firebase.markConversationRead({conversationId: id});
      } catch (e) {
        console.error('markConversationRead failed', e.text);
      }
    }
  };

  const setIdentities = () => {
    if (user.username === conversation.askerUser) {
      setMe(conversation.askerUser);
      setOtherUser(conversation.receiverUser);
      setIsMyOffer(false);
    } else if (user.username === conversation.receiverUser) {
      setMe(conversation.receiverUser);
      setOtherUser(conversation.askerUser);
      setIsMyOffer(true);
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

  let offerTitle, offerDisplay, conversationDisplay = null;

  if (isMyOffer !== null) {
    offerTitle = isMyOffer
      ? <h2>Mon annonce</h2>
      : <h2>L'annonce de {otherUser}</h2>
  }

  if (offerError) {
    offerDisplay = (
      <>
        <p>Une erreur s'est produite, l'offre n'a pas pu être récupérée.</p>
        {offerError.message ? <p className="error">{offerError.message}</p> : null}
      </>
    );
  }  else if (offerLoading) {
    offerDisplay = (
      <Spinner />
    )
  }
  else if (offer) {
    offerDisplay = (
      <>
        {offerTitle}
        <Link href={`/annonce/[id]`} as={`/annonce/${conversation.offer.id}`}>
          <a title="Voir l'annonce" className={classes.conversationDetail__offerLink}>
            <OfferPreview offer={offer} small />
          </a>
        </Link>
      </>
    );
  }

  if (convError) {
    conversationDisplay = (
      <>
        <p>Une erreur s'est produite, la conversation n'a pas pu être récupérée.</p>
        {convError.message ? <p className="error">{convError.message}</p> : null}
      </>
    );
  }
  else if (convLoading && !conversation) {
    conversationDisplay = (
      <Spinner />
    )
  } else if (conversation) {
    conversationDisplay = (
      <>
        <ConversationFrame messages={conversation.messages || []} me={me} loadingMessages={convLoading} />
        <ConversationForm conversationId={id}
                          startConversation={conversation && conversation.askerUser === me && !conversation.messages.length} />
      </>
    )
  }

  return (
    <article>
      <h1>Ma conversation {otherUser ? `avec ${otherUser}`: '' }</h1>

      <div className={classes.conversationDetail}>
        <section className={classes.conversationDetail__conversation}>
          {conversationDisplay}
        </section>
        <section className={classes.conversationDetail__offer}>
          {offerDisplay}
        </section>

      </div>
    </article>
  );
};

export default ConversationDetail;
