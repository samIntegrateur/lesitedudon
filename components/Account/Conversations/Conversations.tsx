import React, {useContext, useEffect} from 'react';
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import ConversationList from '../../Conversation/ConversationList/ConversationList';
import * as actions from '../../../store/actions';
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../../store/types/store.type";
import { Conversation } from "../../../shared/types/conversation.type";
import { ApiStateItem } from "../../../store/types/common.type";
import { ConversationApiState } from "../../../store/types/conversation.type";

// todo tech: distribute user && firebase from profile to each child with props ?
// todo ux: better distinction between asker and receiver's ones
const Conversations: React.FC = () => {

  // ------------------ Context ------------------
  const { loading, user, firebase } = useContext(FirebaseContext);

  // ------------------ Store ------------------
  const conversations = useSelector<StoreState, Conversation[] | null>(state => {
    return state.conversation.conversations
  });

  const {
    loading: getConvsLoading,
    error: getConvsError,
  } = useSelector<StoreState, ApiStateItem>(state => {
    return state.conversation.apiState[ConversationApiState.GET_CONVERSATIONS];
  })

  const dispatch = useDispatch();

  // ------------------ Effects ------------------
  useEffect(() => {
    if (user && user.username && firebase) {
      dispatch(actions.getConversations(firebase));
    }
  }, [user, firebase, dispatch]);


  // ------------------ Template ------------------
  let display: JSX.Element | null = null;

  if (loading || getConvsLoading) {
    display = <Spinner/>
  } else if (getConvsError) {
    display = (
      <>
        <p>Une erreur s'est produite, les conversations n'ont pas pu être récupérées.</p>
        {getConvsError.message ? <p className="error">{getConvsError.message}</p> : null}
      </>
    );
  } else if (user) {
    display = <ConversationList username={user.username} conversations={conversations} />
  }

  return (
    <div>
      {display}
    </div>
  );
};

export default Conversations;
