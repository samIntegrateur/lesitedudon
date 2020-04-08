import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../../layout/Layout';
import ConversationDetail from '../../components/Conversation/ConversationDetail/ConversationDetail';
import FirebaseContext from '../../firebase/context';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions';
import {connect} from 'react-redux';

// do ssr ?
const Index = (props) => {
  const router = useRouter();
  const {loading, user, firebase} = useContext(FirebaseContext);
  const {conversation, getConvLoading, getConvError, onGetConversation} = props;

  const { id } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading]);

  useEffect(() => {
    if (id && user && firebase) {
      console.log('onGetConversation');
      onGetConversation(id, firebase);
    }
  }, [id, user, firebase]);

  const dynamicTitle = `Conversation ${id} - Le site du don`;

  let display = null;

  if (loading || getConvLoading) {
    display = <Spinner />;
  } else if (getConvError) {
    display = (
      <>
        <p>Une erreur s'est produite, la conversation n'a pas pu être récupérée.</p>
        {getConvError.message ? <p className="error">{getConvError.message}</p> : null}
      </>
    )
  } else if (conversation) {
    display = <ConversationDetail conversation={conversation} user={user} />
  }

  return (
    <Layout
      title={dynamicTitle}
      description={dynamicTitle}>

      <div className="part-big">
        {display}
      </div>

      <a onClick={router.back}>Retour</a>
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    conversation: state.conversation.conversation,
    getConvLoading: state.conversation.apiState.getConversation.loading,
    getConvError: state.conversation.apiState.getConversation.error,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onGetConversation: (conversationId, firebase) => dispatch(actions.getConversation(conversationId, firebase)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
