import React, {useEffect, useRef} from 'react';
import classes from './ConversationFrame.module.css';
import Spinner from '../../../UI/Spinner/Spinner';
import DateTime from '../../../UI/DateTime/DateTime';

const ConversationFrame = ({messages, me, loadingMessages}) => {

  const frameRef = useRef(null);

  useEffect(() => {
    if (frameRef.current) {
      // todo: compare message length, we don't want to scroll if only a read has changed
      frameRef.current.scrollTop = frameRef.current.scrollHeight;
    }
  }, [frameRef, messages]);


  return (
    <div className={classes.conversation} ref={frameRef}>
      <ul className={classes.conversation_messageList}>
        {messages.map((message, key) => (
          <li key={key} className={`${classes.conversation_messageListItem} ${message.user === me ? classes.isMe : classes.isYou}`}>
            <div className={classes.conversation_message}>
              <blockquote className={classes.conversation_messageTextWrapper}>
                <p className={classes.conversation_messageText + ' user-content'}>
                  {message.message}
                </p>
              </blockquote>
              <div className={classes.conversation_messageInfos}>
                <h3 className={`${classes.conversation_messageUser}`}>
                  {message.user === me ? 'Moi' : message.user}
                </h3>
                <span className={classes.conversation_messageTime}>
                  <DateTime date={message.timestamp} />
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {loadingMessages &&
        <Spinner small />
      }
    </div>
  );
};

export default ConversationFrame;
