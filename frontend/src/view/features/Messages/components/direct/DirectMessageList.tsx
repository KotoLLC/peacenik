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
    dispatch(Actions.feed.getFeedTokensRequest());
  }, [dispatch]);

  const friends = useSelector<StoreTypes, ApiTypes.Friends.Friend[] | null>(
    (state) => state.friends.friends
  );
  const messages = useSelector<StoreTypes, ApiTypes.Feed.Message[] | null>(
    (state) => state.messages.messages
  );
  const currentUserId = useSelector<StoreTypes, string>(
    (state) => state.profile.user.id
  );
  // console.log(friends);
  // console.log(messages);

  const lastAccessTime = {};

  const calcLastAccessTimes = (
    messages: ApiTypes.Feed.Message[],
    userId: string
  ): void => {
    for (let m of messages) {
      // console.log(jwt_decode(m));
      console.log(m.messageToken);
      console.log(jwt_decode(m.messageToken));
      if (m.user_id === userId && m.friend_id) {
        lastAccessTime[m.friend_id] = {
          user_id: m.friend_id,
        };
      }
    }
  };

  if (messages) {
    calcLastAccessTimes(messages, currentUserId);
    console.log(lastAccessTime);
  }

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

  return (
    <>
      {friends &&
        _.isArray(friends) &&
        friends.map((f) => (
          <DirectMessageListItem
            key={f.user.id}
            userId={f.user.id}
            fullName={f.user.full_name}
            accessTime='123'
            lastMsg='The rules of travel have altered so much in the last few years, with strict reulation regarding.'
            missedCount={2}
            msgType={MessageDirection.INCOMMING_MESSAGE}
          />
        ))}
    </>
  );
};

export default DirectMessageList;
