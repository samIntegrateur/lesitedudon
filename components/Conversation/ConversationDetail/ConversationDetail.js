import React from 'react';

const ConversationDetail = ({conversation}) => {
  console.log('conversation', conversation);
  return (
    <div>
      <p>{conversation.askerUser}</p>
      <p>{conversation.receiverUser}</p>
      <p>{conversation.offer}</p>
    </div>
  );
};

export default ConversationDetail;
