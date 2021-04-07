import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '@store/actions';
import _ from 'lodash';

import DirectMessageListItem from './DirectMessageListItem';
import { MessageDirection, MessagePublishStatus } from '../../types/types';
import { ApiTypes, StoreTypes } from 'src/types';
import jwt_decode from 'jwt-decode';

const DirectMessageList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.friends.getFriendsRequest());
    dispatch(Actions.messages.getMessageTokensRequest());
  }, [dispatch]);

  const friends = useSelector<StoreTypes, ApiTypes.Friends.Friend[] | null>(
    (state) => state.friends.friends
  );
  const lastMessages = useSelector<
    StoreTypes,
    ApiTypes.Messages.UserMessage[] | null
  >((state) => state.messages.usersLastMessage);
  const currentUserId = useSelector<StoreTypes, string>(
    (state) => state.profile.user.id
  );

  //   {
  //     "user": {
  //         "id": "3d44c2da-b371-4d57-9fed-5a2e404f7e90",
  //         "name": "andy",
  //         "email": "",
  //         "full_name": "Andy",
  //         "is_confirmed": false,
  //         "hide_identity": false
  //     },
  //     "friends": [],
  //     "group_count": 0
  // }
  console.log('lastMessages', lastMessages);

  return (
    <>
      {lastMessages &&
        _.isArray(lastMessages) &&
        lastMessages.map((f) => (
          <DirectMessageListItem
            key={f.user_id}
            userId={f.user_id}
            fullName={f.full_name || ''}
            accessTime={f.lastMessageDate || ''}
            lastMsg='The rules of travel have altered so much in the last few years, with strict reulation regarding.'
            missedCount={2}
            msgType={
              currentUserId === f.user_id
                ? MessageDirection.OUTGOING_MESSAGE
                : MessageDirection.INCOMMING_MESSAGE
            }
          />
        ))}
    </>
  );
};

export default DirectMessageList;
