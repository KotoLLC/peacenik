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
  
  const msgRoomFriends = useSelector<StoreTypes, string[]>(
    (state) => state.messages.directMsgRoomFriends
  );

  return (
    <>
      {msgRoomFriends.map((friend, idx) => (
          <DirectMessageListItem
            key={idx}
            userId={friend}
            fullName={"Matt" || ''}
            accessTime={"111-11" || ''}
          />
        ))}
    </>
  );
};

export default DirectMessageList;
