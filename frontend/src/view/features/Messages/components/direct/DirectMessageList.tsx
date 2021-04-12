import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '@store/actions';
import _ from 'lodash';

import DirectMessageListItem from './DirectMessageListItem';
import { CommonTypes, ApiTypes, StoreTypes } from 'src/types';
import jwt_decode from 'jwt-decode';

const DirectMessageList = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(Actions.friends.getFriendsRequest());
  //   dispatch(Actions.messages.getMessageTokensRequest());
  // }, [dispatch]);

  const friends = useSelector<StoreTypes, ApiTypes.Friends.Friend[] | null>(
    (state) => state.friends.friends
  );
  const lastMessages = useSelector<
    StoreTypes,
    ApiTypes.Messages.UserMessage[] | null
  >((state) => state.messages.usersLastMessage);
  
  const msgRoomFriends = useSelector<StoreTypes, CommonTypes.MessageRoomFriendData[]>(
    (state) => state.messages.directMsgRoomFriends
  );

  return (
    <>
      {msgRoomFriends.map((friend, idx) => (
          <DirectMessageListItem
            key={idx}
            userId={friend.id}
            fullName={friend.fullName || ''}
            accessTime={friend.accessTime || ''}
          />
        ))}
    </>
  );
};

export default DirectMessageList;
