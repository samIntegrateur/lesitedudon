import React from 'react';
import classes from './ConversationPreview.module.css';
import DateTime from '../../UI/DateTime/DateTime';
import OfferPreview from '../../Offer/OfferPreview/OfferPreview';
import Link from 'next/link';

const ConversationPreview = ({conversation}) => {
  return (
    <article className={classes.conversationPreview}>
      <Link href={`/conversation/[id]`} as={`/conversation/${conversation.id}`}>
        <a title="Voir la conversation" className={classes.conversationPreview__conversation}>
          <h2 className={classes.conversationPreview__user}>
            {conversation.otherUser}
          </h2>
          <p className={classes.conversationPreview__interest}>
            {conversation.offer.isMine
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
