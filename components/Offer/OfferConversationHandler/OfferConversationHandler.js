import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';
import * as actions from '../../../store/actions';
import {connect} from 'react-redux';
import OfferDetail from '../OfferDetail/OfferDetail';
import {useRouter} from 'next/router';

const OfferConversationHandler = (props) => {
  const router = useRouter();
  const {
    offer, offerId,
    conversationIdFromCheck,
    checkConversation,
    postConversation,
    onCheckConversation,
    conversationIdFromPost,
    onPostConversation, onPostConversationClear,
  } = props;

  let modalDisplay = null;

  const [modalOpen, setModalOpen] = useState(false);
  const [conversationAvailable, setConversationAvailable] = useState(false);
  const [conversationAvailabilityLoading, setConversationAvailabilityLoading] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

  const {user, firebase} = useContext(FirebaseContext);

  // If not authent or if it's user's offer, we don't want conversation button
  useEffect(() => {
    const available = !!user && !!user.username && user.username !== offer.author && !!firebase;
    setConversationAvailable(available);
    if (available && !checkDone) {
      setConversationAvailabilityLoading(true);
      const conversation = {
        offerId: offerId,
        askerUserId: user.username,
        receiverUserId: offer.author,
      };

      onCheckConversation(conversation, firebase);
    }
  }, [offerId, user, firebase]);

  useEffect(() => {
    // display a loader in place of button until first check has been made
    if (checkConversation && (checkConversation.error || checkConversation.success)) {
      setConversationAvailabilityLoading(false);
      setCheckDone(true);
    }
  }, [checkConversation]);

  useEffect(() => {
    // Redirect after conversation creation
    if (conversationIdFromPost) {
      console.log('use effect should redirect');
      clearHandler();

      goToConversation(conversationIdFromPost);
    }
  }, [conversationIdFromPost]);

  const goToConversation = (id) => {
    console.log('goToConversation');
    router.push('/conversation/[id]', `/conversation/${id}`);
  };

  const sendMessageHandler = () => {
    if (conversationIdFromCheck) {
      goToConversation(conversationIdFromCheck);
    } else {
      setModalOpen(true);
      if (!checkConversation.loading) {
        const newConversation = {
          offerId: offer.id,
          askerUserId: user.username,
          receiverUserId: offer.author,
        };
        onPostConversation(newConversation, firebase);
      }
    }
  };

  const clearHandler = () => {
    onPostConversationClear();
    setModalOpen(false);
  };

  if (postConversation.loading) {
    modalDisplay = (
      <div>
        <p>Création d'une nouvelle conversation...</p>
        <Spinner/>
      </div>
    )
  } else if (postConversation.error) {
    modalDisplay = (
      <div>
        <p>Une erreur s'est produite, la conversation n'a pu être créée.</p>

        {postConversation.error.message ? <p className="error">{postConversation.error.message}</p> : null}

        <Button type="button"
                style="secondary"
                clicked={clearHandler}>
          Ok
        </Button>
      </div>
    );
  }

  return (
    <>
      <Modal show={modalOpen} modalClosed={() => {}}>
        {modalDisplay}
      </Modal>
      <OfferDetail offer={offer}
                   sendMessageClicked={sendMessageHandler}
                   conversationAvailabilityLoading={conversationAvailabilityLoading}
                   conversationAvailable={conversationAvailable} />
    </>
  );
};

const mapStateToProps = state => {
  return {
    checkConversation: state.conversation.apiState.checkConversation,
    conversationIdFromCheck: state.conversation.apiState.checkConversation.hasConversation,
    postConversation: state.conversation.apiState.postConversation,
    conversationIdFromPost: state.conversation.apiState.postConversation.newConversationId,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckConversation: (id, firebase) => dispatch(actions.checkConversation(id, firebase)),
    onPostConversation: (conversation, firebase) => dispatch(actions.postConversation(conversation, firebase)),
    onPostConversationClear: () => dispatch(actions.postConversationClear()),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(OfferConversationHandler);
