import React, { useCallback, useEffect, useState } from "react";
import classes from './ConversationDetail.module.css';
import OfferPreview from '../../Offer/OfferPreview/OfferPreview';
import Link from 'next/link';
import ConversationFrame from './ConversationFrame/ConversationFrame';
import ConversationForm from './ConversationForm/ConversationForm';
import Spinner from '../../UI/Spinner/Spinner';
import { UserEnhanced } from "../../../firebase/firebase.type";
import { Firebase } from "../../../firebase/firebase";
import { Conversation } from "../../../shared/types/conversation.type";
import { Offer } from "../../../shared/types/offer.type";
import firebase from "firebase";

// We get conversation without full offer and get offer separately
// maybe we should simplify with just one call
interface ConversationDetailProps {
  id: string;
  user: UserEnhanced;
  firebase: Firebase;
}
const ConversationDetail: React.FC<ConversationDetailProps> = (
  {
    id,
    user,
    firebase
  }
) => {

  // ------------------ State ------------------
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [convError, setConvError] = useState<Error | null>(null);
  const [convLoading, setConvLoading] = useState<boolean>(false);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [offerLoading, setOfferLoading] = useState<boolean>(true);
  const [offerError, setOfferError] = useState<Error | null>(null);

  const [me, setMe] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<string | null>(null);
  const [isMyOffer, setIsMyOffer] = useState<boolean>(false);

  const getOffer = useCallback((id: string): void => {
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
  }, [firebase]);

  const checkUnreadMessages = useCallback((unreadMessages: { [key: string]: number }): void => {
    // if new unread messages send markConversationRead
    if (unreadMessages[user.username] > 0) {
      try {
        firebase.markConversationRead({conversationId: id});
      } catch (e) {
        console.error('markConversationRead failed', e.text);
      }
    }
  }, [firebase, id, user]);

  const handleConversationSnapshot = useCallback((
    conversationSnapshot: Conversation,
  ): void => {
    checkUnreadMessages(conversationSnapshot.unreadMessages);
    setConversation(conversationSnapshot);
    const id = conversationSnapshot.offer;
    if (id !== offerId && typeof(id) === 'string') {
      setOfferId(id);
      getOffer(id);
    }
  }, [checkUnreadMessages, getOffer, offerId]);

  // ------------------ Effects ------------------
  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe;
    if (user && user.username && firebase && id) {
      setConvLoading(true);
      unsubscribe = firebase.subscribeToConversation({
        conversationId: id,
        handleSnapshot: (conversationSnapshot) => {
          setConvLoading(false);
          handleConversationSnapshot(conversationSnapshot);
        },
        handleError: (error) => {
          setConvLoading(false);
          setConvError(error);
        }
      })
    }

    return (): void => {
      if(unsubscribe) {
        unsubscribe();
      }
    }
  }, [user, firebase, id, handleConversationSnapshot]);

  const isReadyForIdentities = useCallback((): boolean => {
    return (
      !!user && !!user.username
      && !!conversation && !!conversation.askerUser && !!conversation.receiverUser
    );
  }, [user, conversation]);

  const setIdentities = useCallback((): void => {
    if (user.username === conversation?.askerUser) {
      setMe(conversation.askerUser);
      setOtherUser(conversation.receiverUser);
      setIsMyOffer(false);
    } else if (user.username === conversation?.receiverUser) {
      setMe(conversation.receiverUser);
      setOtherUser(conversation.askerUser);
      setIsMyOffer(true);
    }
  }, [user, conversation]);

  useEffect(() => {
    if (isReadyForIdentities()) {
      setIdentities();
    }
  }, [isReadyForIdentities, setIdentities]);



  // ------------------ Template ------------------
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
        <Link href={`/annonce/[id]`} as={`/annonce/${offerId}`}>
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
  } else if (conversation && me) {
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
