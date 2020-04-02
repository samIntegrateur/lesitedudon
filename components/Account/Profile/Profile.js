import React, {useContext} from 'react';
import FirebaseContext from '../../../firebase/context';
import ListKeyValue from '../../UI/ListKeyValue/ListKeyValue';
import {format} from "date-fns";

const Profile = () => {

  const {user} = useContext(FirebaseContext);
  console.log('user', user);

  const creationDate = new Date(user.metadata.creationTime);
  const formattedDate = format(creationDate, 'dd/MM/yyyy') || creationDate;

  const data = [
    {
      label: 'Nom d\'utilisateur',
      value: user.username
    }, {
      label: 'E-mail',
      value: user.email,
    }, {
      label: 'Membre depuis le',
      value: formattedDate,
    }, {
      label: 'Nombre de dons',
      value: user.userProfile.offersNumber || 0,
    }
  ];

  return (
    <div>
      <ListKeyValue data={data} />
    </div>
  );
};

export default Profile;
