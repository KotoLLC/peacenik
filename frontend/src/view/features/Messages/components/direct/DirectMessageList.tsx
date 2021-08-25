import React from 'react';
import { useSelector } from 'react-redux';
// import Actions from '@store/actions';
// import _ from 'lodash';
import { RouteComponentProps } from 'react-router-dom'
import DirectMessageListItem from './DirectMessageListItem';
import { CommonTypes, StoreTypes } from 'src/types';
// import jwt_decode from 'jwt-decode';

interface Props extends RouteComponentProps { }

const DirectMessageList: React.FC<Props> = (props) => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(Actions.friends.getFriendsRequest());
  //   dispatch(Actions.messages.getMessageTokensRequest());
  // }, [dispatch]);

  const { location } = props

  // const friends = useSelector<StoreTypes, ApiTypes.Friends.Friend[] | null>(
  //   (state) => state.friends.friends
  // );
  // const lastMessages = useSelector<
  //   StoreTypes,
  //   ApiTypes.Messages.UserMessage[] | null
  // >((state) => state.messages.usersLastMessage);

  const msgRoomFriends = useSelector<StoreTypes, CommonTypes.MessageRoomFriendData[]>(
    (state) => state.messages.directMsgRoomFriends
  );

  return (
    <>
      {msgRoomFriends.map((friend, idx) => (
        <DirectMessageListItem
          key={idx}
          location={location}
          userId={friend.id}
          fullName={friend.fullName || ''}
          accessTime={friend.accessTime || ''}
        />
      ))}
    </>
  );
};

export default DirectMessageList;
