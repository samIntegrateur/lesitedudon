import React, { useContext, useEffect, useState } from "react";
import FirebaseContext from '../../../firebase/context';
import ListKeyValue from '../../UI/ListKeyValue/ListKeyValue';
import {format} from "date-fns";
import { KeyValueType } from "../../UI/ListKeyValue/ListKeyValue.type";

const Profile: React.FC = () => {

  const { user } = useContext(FirebaseContext);

  const [profileDataList, setProfileDataList] = useState<KeyValueType[]>([]);

  useEffect(() => {
    if (user && user.username && user.userProfile) {

      const creationTime = user.metadata.creationTime;
      let formattedDate;

      if (creationTime) {
        const creationDate = new Date(creationTime);
        formattedDate = format(creationDate, 'dd/MM/yyyy') || creationDate;
      } else {
        formattedDate = '/';
      }

      setProfileDataList([
        {
          key: 'Nom d\'utilisateur',
          value: user.username
        }, {
          key: 'E-mail',
          value: user.email || '/',
        }, {
          key: 'Membre depuis le',
          value: formattedDate,
        }, {
          key: 'Nombre de dons',
          value: user.userProfile.offersNumber || 0,
        }
      ])
    }
  }, [user]);

  return (
    <div>
      {profileDataList.length > 0 &&
        <ListKeyValue dataList={profileDataList} />
      }
    </div>
  );
};

export default Profile;
