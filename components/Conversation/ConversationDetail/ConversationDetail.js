import React, {useEffect, useState} from 'react';
import classes from './ConversationDetail.module.css';
import OfferPreview from '../../Offer/OfferPreview/OfferPreview';
import Link from 'next/link';
import ConversationFrame from './ConversationFrame/ConversationFrame';

const ConversationDetail = ({conversation, user}) => {

  const {askerUser, receiverUser, offer} = conversation;

  const [me, setMe] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [isMyOffer, setIsMyOffer] = useState(null);

  useEffect(() => {
    if (user && user.username) {
      console.log('user.username', user.username);
      if (user.username === askerUser) {
        setMe(askerUser);
        setOtherUser(receiverUser);
        setIsMyOffer(false);
      } else if (user.username === receiverUser) {
        setMe(receiverUser);
        setOtherUser(askerUser);
        setIsMyOffer(true);
      }
    }
  }, [user, askerUser, receiverUser, setMe, setOtherUser, setIsMyOffer]);


  let offerTitle = null;

  if (isMyOffer !== null) {
      offerTitle = isMyOffer
        ? <h2>Mon annonce</h2>
        : <h2>L'annonce de {otherUser}</h2>
  }


  const date = new Date();
  const messages = [
    {
      user: 'sam',
      message: 'Lorem ipsum',
      timestamp: date,
    },
    {
      user: 'bob',
      message: 'lorem',
      timestamp: date,
    },
    {
      user: 'sam',
      message: 'Lorem ipsum dolor sit amet',
      timestamp: date,
    },
    {
      user: 'sam',
      message: 'Lorem ipsum',
      timestamp: date,
    },
    {
      user: 'bob',
      message: 'lorem',
      timestamp: date,
    },
  ];

  return (
    <article>
      <h1>Ma conversation {otherUser ? `avec ${otherUser}`: '' }</h1>

      <div className={classes.conversationDetail}>
        <section className={classes.conversationDetail__conversation}>
          <ConversationFrame messages={messages} me={me} />
        </section>
        <section className={classes.conversationDetail__offer}>
          {offerTitle}
          <Link href={`/annonce/[id]`} as={`/annonce/${conversation.offer.id}`}>
            <a title="Voir l'annonce" className={classes.conversationDetail__offerLink}>
              <OfferPreview offer={offer} small />
            </a>
          </Link>
        </section>

      </div>
    </article>
  );
};

export default ConversationDetail;
