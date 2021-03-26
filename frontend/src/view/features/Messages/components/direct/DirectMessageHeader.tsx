import React from "react";
import { useRouteMatch } from "react-router";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { IconButton } from "@material-ui/core";

import {
  ContactAvatarStyled,
  DirectMessageWrapper,
  ContactUserInfo,
  UserInfoBlock,
  UserInfoName,
  UserInfoStatus,
  DMInHeaderWrapper,
} from "../styles";
import useGetUserInfoById from "@services/hooks/useGetUserInfoById";

const DirectMessageHeader = () => {
  const getUserInfo = useGetUserInfoById();

  const userid = useRouteMatch().params["id"] || undefined;
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
      <IconButton aria-label="delete">
        <ExpandMoreIcon />
      </IconButton>
    </DMInHeaderWrapper>
  );
};

export default DirectMessageHeader;
