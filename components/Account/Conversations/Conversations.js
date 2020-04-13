import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import ConversationList from '../../Conversation/ConversationList/ConversationList';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';

const Conversations = (props) => {
  const {
    conversations, getConvsLoading, getConvsError, getConvsSuccess,
    onGetConversations, onGetConversationsClear,
  } = props;
  const {loading, user, firebase} = useContext(FirebaseContext);

  // todo tech: distribute user && firebase from profile to each child with props ?
  // todo ux: better distinction between asker and receiver's ones

  useEffect(() => {
    if (user && user.username && firebase) {
      onGetConversations(firebase);
    }
  }, [user, firebase, onGetConversations]);

  let display = null;

  if (loading || getConvsLoading) {
    display = <Spinner/>
  } else if (getConvsError) {
    display = (
      <>
        <p>Une erreur s'est produite, les conversations n'ont pas pu être récupérées.</p>
        {getConvsError.message ? <p className="error">{getConvsError.message}</p> : null}
      </>
    );
  } else {
    display = <ConversationList conversations={conversations} />
  }

  return (
    <div>
      {display}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    conversations: state.conversation.conversations,
    getConvsLoading: state.conversation.apiState.getConversations.loading,
    getConvsError: state.conversation.apiState.getConversations.error,
    getConvSuccess: state.conversation.apiState.getConversations.success,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onGetConversations: (firebase) => dispatch(actions.getConversations(firebase)),
    onGetConversationsClear: () => dispatch(actions.getConversationsClear()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
