import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';
import OfferDetail from '../OfferDetail/OfferDetail';
import {useRouter} from 'next/router';
import { Offer } from "../../../shared/types/offer.type";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../../store/types/store.type";
import {
  CheckConversationState,
  ConversationApiState,
  PostConversationState
} from "../../../store/types/conversation.type";
import * as actions from "../../../store/actions";
import { ConversationForCreation } from "../../../shared/types/conversation.type";

interface OfferConversationHandlerProps {
  offer: Offer;
  offerId: string;
}
const OfferConversationHandler: React.FC<OfferConversationHandlerProps> = ({
  offer, offerId
}) => {

  const router = useRouter();
  const context = useContext(FirebaseContext);
  const {user, firebase} = context;
  const dispatch = useDispatch();

  const checkConversationState = useSelector<StoreState, CheckConversationState>(state =>
    state.conversation.apiState[ConversationApiState.CHECK_CONVERSATION]
  );
  const { hasConversation } = checkConversationState;

  const postConversationState = useSelector<StoreState, PostConversationState>(state =>
    state.conversation.apiState[ConversationApiState.POST_CONVERSATION]
  );
  const { newConversationId } = postConversationState;

  let modalDisplay = null;

  const [modalOpen, setModalOpen] = useState(false);
  const [conversationAvailable, setConversationAvailable] = useState(false);
  const [conversationAvailabilityLoading, setConversationAvailabilityLoading] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

  const goToConversation = (id: string) => {
    router.push('/conversation/[id]', `/conversation/${id}`);
  };

  // If not authent or if it's user's offer, we don't want conversation button
  useEffect(() => {
    const available = !!user && !!user.username && user.username !== offer.author && !!firebase;
    setConversationAvailable(available);

    if (available && !checkDone && user && firebase) {
      setConversationAvailabilityLoading(true);
      const conversation: ConversationForCreation = {
        offerId: offerId,
        askerUserId: user.username,
        receiverUserId: offer.author,
      };

      dispatch(actions.checkConversation(conversation, firebase));
    }
  }, [offerId, user, firebase, checkDone, dispatch, offer.author]);

  useEffect(() => {
    // display a loader in place of button until first check has been made
    if (checkConversationState && (checkConversationState.error || checkConversationState.success)) {
      setConversationAvailabilityLoading(false);
      setCheckDone(true);
    }
  }, [checkConversationState]);

  useEffect(() => {
    // Redirect after conversation creation
    if (newConversationId) {
      dispatch(actions.postConversationClear());

      goToConversation(newConversationId);
    }
  }, [newConversationId]);

  const sendMessageHandler = () => {
    if (typeof(hasConversation) === "string") {
      goToConversation(hasConversation);
    } else {
      setModalOpen(true);
      if (!checkConversationState.loading && user && firebase) {
        const newConversation = {
          offerId: offer.id,
          askerUserId: user.username,
          receiverUserId: offer.author,
        };
        dispatch(actions.postConversation(newConversation, firebase));
      }
    }
  };

  const clearHandler = () => {
    dispatch(actions.postConversationClear());
    setModalOpen(false);
  };

  if (postConversationState.loading) {
    modalDisplay = (
      <div>
        <p>Création d'une nouvelle conversation...</p>
        <Spinner/>
      </div>
    )
  } else if (postConversationState.error) {
    modalDisplay = (
      <div>
        <p>Une erreur s'est produite, la conversation n'a pu être créée.</p>

        {postConversationState.error.message ? <p className="error">{postConversationState.error.message}</p> : null}

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
      <Modal show={modalOpen} modalClosed={() => null}>
        {modalDisplay}
      </Modal>
      <OfferDetail offer={offer}
                   sendMessageClicked={sendMessageHandler}
                   conversationAvailabilityLoading={conversationAvailabilityLoading}
                   conversationAvailable={conversationAvailable} />
    </>
  );
};

export default OfferConversationHandler;
