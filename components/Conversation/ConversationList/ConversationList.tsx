import React from 'react';
import Button from '../../UI/Button/Button';
import ConversationPreview from '../ConversationPreview/ConversationPreview';
import classes from './ConversationList.module.css';
import { Conversation } from "../../../shared/types/conversation.type";

interface ConversationListProps {
  username: string;
  conversations: Conversation[];
}
const ConversationList: React.FC<ConversationListProps> = (
  {
    username,
    conversations,
  }
) => {

  let conversationsDisplay;

  if (conversations) {
    if (conversations.length) {
      conversationsDisplay = (
        <ul className={classes.conversationList}>
          {conversations.map(conversation => (
            <li key={conversation.id} className={classes.conversationList__item}>

              <ConversationPreview username={username} conversation={conversation} />
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
