import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import ConversationList from '../../Conversation/ConversationList/ConversationList';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);

  // todo : distribute user && firebase from profile to each child with props ?
  // todo : better distinction between asker and receiver's ones
  const {user, firebase} = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (user && user.username && firebase) {
      setIsLoading(true);
      unsubscribe = firebase.subscribeToUserConversations({
        username: user.username,
        handleSnapshot: (conversationsSnapshot) => {
          console.log('conversationsSnapshot', conversationsSnapshot);
          setIsLoading(false);
          setConversations(conversationsSnapshot);
        },
        handleError: (error) => {
          setIsLoading(false);
          setError(error);
        }
      })
    }

    return () => {
      if(unsubscribe) {
        unsubscribe();
      }
    }
  }, [user, firebase]);

  let display = null;

  if (isLoading) {
    display = <Spinner/>
  } else if (error) {
    display = (
      <>
        <p>Une erreur s'est produite, les conversations n'ont pas pu être récupérées.</p>
        {error.message ? <p className="error">{error.message}</p> : null}
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

export default Conversations;
