import React, {useContext, useEffect, useState} from 'react';
import FirebaseContext from '../../../firebase/context';
import Spinner from '../../UI/Spinner/Spinner';
import ConversationList from '../../Conversation/ConversationList/ConversationList';

const Conversations = () => {
  const [conversations, setConversations] = useState([
    {
      id: '1',
      dateCreated: '1995-12-17T03:24:00',
      dateUpdated: '2020-12-17T03:24:00',
      otherUser: 'Bob',
      offer: {
        id: '1',
        isMine: false,
        author: 'Bob',
        dateCreated: '1995-12-17T03:24:00',
        title: 'lorem ipsum',
        thumbUrl: 'https://storage.googleapis.com/le-site-du-don.appspot.com/offers/thumb-5rsjXDtOD3iMIjHDLhYO.jpeg?GoogleAccessId=le-site-du-don%40appspot.gserviceaccount.com&Expires=16730323200&Signature=cDPGN0Hzp8%2Bn8XbUHJyl3025qIso%2FltFTyrYg2QhRu9hXtlWAHE2fkjSUSau80VDhstK2W%2BSdvRPgrHlf6E8UNuQUU163f41iat81iTfsdxH5eDELstL6E9LNO4Xvj1lFkqp29wn1aTYSQzm4ZwXtI7JhTkgpWnbsajrqSxPAqMQDQkB55tu6QN5mZ7LJE016wI1PjCHEud%2BO%2Ba1BfwG1%2BARNoWU9xVpV7SeAB%2BYG%2B5vW5tLLxd20cTMH%2F8jTT6dNmHbzu61cJ%2BWFygj6zSxnSMqB%2FQDOMqj%2F5a1TO3FL40VTsNXui7B9co2pHOQKHnILMJiwPeKthAOvOL2oURVKQ%3D%3D'
      },
    },
    {
      id: '2',
      dateCreated: '1995-12-17T03:24:00',
      dateUpdated: '2019-12-17T03:24:00',
      otherUser: 'Bob',
      offer: {
        id: '2',
        isMine: false,
        author: 'Sam',
        dateCreated: '1995-12-17T03:24:00',
        title: 'lorem ipsum',
        thumbUrl: 'https://storage.googleapis.com/le-site-du-don.appspot.com/offers/thumb-5rsjXDtOD3iMIjHDLhYO.jpeg?GoogleAccessId=le-site-du-don%40appspot.gserviceaccount.com&Expires=16730323200&Signature=cDPGN0Hzp8%2Bn8XbUHJyl3025qIso%2FltFTyrYg2QhRu9hXtlWAHE2fkjSUSau80VDhstK2W%2BSdvRPgrHlf6E8UNuQUU163f41iat81iTfsdxH5eDELstL6E9LNO4Xvj1lFkqp29wn1aTYSQzm4ZwXtI7JhTkgpWnbsajrqSxPAqMQDQkB55tu6QN5mZ7LJE016wI1PjCHEud%2BO%2Ba1BfwG1%2BARNoWU9xVpV7SeAB%2BYG%2B5vW5tLLxd20cTMH%2F8jTT6dNmHbzu61cJ%2BWFygj6zSxnSMqB%2FQDOMqj%2F5a1TO3FL40VTsNXui7B9co2pHOQKHnILMJiwPeKthAOvOL2oURVKQ%3D%3D'
      },
    },
    {
      id: '3',
      dateCreated: '1995-12-17T03:24:00',
      dateUpdated: '2020-12-17T03:24:00',
      otherUser: 'Bob',
      offer: {
        id: '3',
        isMine: true,
        author: 'Sam',
        dateCreated: '1995-12-17T03:24:00',
        title: 'lorem ipsum',
        thumbUrl: 'https://storage.googleapis.com/le-site-du-don.appspot.com/offers/thumb-5rsjXDtOD3iMIjHDLhYO.jpeg?GoogleAccessId=le-site-du-don%40appspot.gserviceaccount.com&Expires=16730323200&Signature=cDPGN0Hzp8%2Bn8XbUHJyl3025qIso%2FltFTyrYg2QhRu9hXtlWAHE2fkjSUSau80VDhstK2W%2BSdvRPgrHlf6E8UNuQUU163f41iat81iTfsdxH5eDELstL6E9LNO4Xvj1lFkqp29wn1aTYSQzm4ZwXtI7JhTkgpWnbsajrqSxPAqMQDQkB55tu6QN5mZ7LJE016wI1PjCHEud%2BO%2Ba1BfwG1%2BARNoWU9xVpV7SeAB%2BYG%2B5vW5tLLxd20cTMH%2F8jTT6dNmHbzu61cJ%2BWFygj6zSxnSMqB%2FQDOMqj%2F5a1TO3FL40VTsNXui7B9co2pHOQKHnILMJiwPeKthAOvOL2oURVKQ%3D%3D'
      },
    }
  ]);

  // todo : distribute user && firebase from profile to each child with props ?
  const {user, firebase} = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
    }
  }, []);

  return (
    <div>
      {isLoading ? <Spinner/> : <ConversationList conversations={conversations} />}
    </div>
  );
};

export default Conversations;
