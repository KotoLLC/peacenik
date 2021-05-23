import React from 'react';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux'
import { StoreTypes } from 'src/types'
import { getAvatarUrl } from '@services/avatarUrl';

import {
  ContactAvatarStyled,
  ContactUserInfo,
  UserInfoBlock,
  UserInfoName,
  UserInfoStatus,
  DMInHeaderWrapper,
} from '../styles';

import DirectMessageDropDownMenu from './DirectMessageDropDownMenu';

const DirectMessageHeader = () => {
  // const getUserInfo = useGetUserInfoById();

  const friends = useSelector( (state: StoreTypes) => state.friends.friends )

  const userid = useRouteMatch().params['id'] || undefined;
  let userInfo;
  if ( friends) {
    friends.forEach(friend => {
      if ( friend.user.id === userid){
        userInfo = friend.user
      }
    });
  }
  return (
    <DMInHeaderWrapper>
      <ContactUserInfo>
        <ContactAvatarStyled src={getAvatarUrl(userid)} />
        <UserInfoBlock>
          <UserInfoName>{userInfo?.full_name}</UserInfoName>
          {/* <UserInfoStatus>Online</UserInfoStatus> */}
        </UserInfoBlock>
      </ContactUserInfo>
      {/* <DirectMessageDropDownMenu /> */}
    </DMInHeaderWrapper>
  );
};

export default DirectMessageHeader;
