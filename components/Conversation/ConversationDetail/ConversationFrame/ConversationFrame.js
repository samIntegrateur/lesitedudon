import React from 'react';
import classes from './ConversationFrame.module.css';

const ConversationFrame = ({messages, me}) => {
  return (
    <div className={classes.conversation}>
      <ul className={classes.conversation_messageList}>
        {messages.map((message, key) => (
          <li key={key} className={`${classes.conversation_messageListItem} ${message.user === me ? classes.isMe : classes.isYou}`}>
            <div className={classes.conversation_message}>
              <blockquote className={classes.conversation_messageTextWrapper}>
                <p className={classes.conversation_messageText}>
                  {message.message}
                </p>
              </blockquote>
              <div className={classes.conversation_messageInfos}>
                <h3 className={`${classes.conversation_messageUser}`}>
                  {message.user === me ? 'Moi' : message.user}
                </h3>
                <span className={classes.conversation_messageTime}>
                  10/12/20
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationFrame;
