import React, {useEffect, useState} from 'react';
import classes from './ConversationPreview.module.css';
import DateTime from '../../UI/DateTime/DateTime';
import OfferPreview from '../../Offer/OfferPreview/OfferPreview';
import Link from 'next/link';
import Badge from '../../UI/Badge/Badge';

const ConversationPreview = ({username, conversation}) => {
  const [otherUser, setOtherUser] = useState(null);
  const [isMyOffer, setIsMyOffer] = useState(null);

  useEffect(() => {
    if (conversation.askerUser === username) {
      setOtherUser(conversation.receiverUser);
      setIsMyOffer(false);
    } else {
      setOtherUser(conversation.askerUser);
      setIsMyOffer(true);
    }
  }, [username, conversation]);


  let badgeDisplay = null;
  const newMessages = conversation.unreadMessages[username];
  if (newMessages > 0) {
    const title = `Vous avez ${newMessages} ${newMessages > 1 ? 'nouveaux messages' : 'nouveau message'}`;
    badgeDisplay = (
      <Badge style="secondary" title={title}>
        {conversation.unreadMessages[username]}
      </Badge>
    );
  }

  return (
    <article className={classes.conversationPreview}>
      <Link href={`/conversation/[id]`} as={`/conversation/${conversation.id}`}>
        <a title="Voir la conversation" className={classes.conversationPreview__conversation}>
          <h2 className={classes.conversationPreview__user}>
            {badgeDisplay}
            <span>{otherUser}</span>
          </h2>
          <p className={classes.conversationPreview__interest}>
            {isMyOffer
              ? 'Est intéressé par votre annonce.'
              : 'Vous êtes intéressé par son annonce.'
            }
          </p>
          <p className={classes.conversationPreview__time}>
            Dernier message&nbsp;:
            <DateTime date={conversation.dateUpdated} />
          </p>
        </a>
      </Link>
      <Link href={`/annonce/[id]`} as={`/annonce/${conversation.offer.id}`}>
        <a title="Voir l'annonce" className={classes.conversationPreview__offer}>
          <OfferPreview offer={conversation.offer} small />
        </a>
      </Link>
    </article>
  );
};

export default ConversationPreview;
