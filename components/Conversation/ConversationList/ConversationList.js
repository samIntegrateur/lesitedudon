import React from 'react';
import Button from '../../UI/Button/Button';
import ConversationPreview from '../ConversationPreview/ConversationPreview';
import classes from './ConversationList.module.css';

const ConversationList = ({conversations}) => {

  let conversationsDisplay = null;

  if (conversations) {
    if (conversations.length) {
      conversationsDisplay = (
        <ul className={classes.conversationList}>
          {conversations.map(conversation => (
            <li key={conversation.id} className={classes.conversationList__item}>
              <ConversationPreview conversation={conversation} />
            </li>
          ))}
        </ul>
      );
    } else {
      conversationsDisplay = <p>Vous n'avez pas encore de conversations.</p>;
    }
  } else {
    conversationsDisplay = (
      <div>
        <p>
          Une erreur s'est produite, les conversations n'ont pas pu être récupérées.
          Veuillez nous excuser pour le désagrément.
        </p>
        <Button type="a"
                style="default"
                href="/">
          Retourner à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div>
      {conversationsDisplay}
    </div>
  );
};

export default ConversationList;