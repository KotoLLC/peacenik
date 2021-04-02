import React from 'react';
import { useRouteMatch } from 'react-router';

import {
  ContactAvatarStyled,
  ContactUserInfo,
  UserInfoBlock,
  UserInfoName,
  UserInfoStatus,
  DMInHeaderWrapper,
} from '../styles';

import useGetUserInfoById from '@services/hooks/useGetUserInfoById';
import DirectMessageDropDownMenu from './DirectMessageDropDownMenu';

const DirectMessageHeader = () => {
  const getUserInfo = useGetUserInfoById();

  const userid = useRouteMatch().params['id'] || undefined;
  const userInfo = getUserInfo(userid);

  return (
    <DMInHeaderWrapper>
      <ContactUserInfo>
        <ContactAvatarStyled alt={userInfo.fullName} src={userInfo.avatarUrl} />
        <UserInfoBlock>
          <UserInfoName>{userInfo.fullName}</UserInfoName>
          <UserInfoStatus>{userInfo.status}</UserInfoStatus>
        </UserInfoBlock>
      </ContactUserInfo>
      <DirectMessageDropDownMenu />
    </DMInHeaderWrapper>
  );
};

export default DirectMessageHeader;
