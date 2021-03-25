import React, { useState } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import { ButtonContained } from "@view/shared/styles";
import DirectMessageList from "./DirectMessageList";
import {
  AvatarStyled,
  AvatarWrapperLink,
  SidebarHeader,
  SidebarWrapper,
  UserNameLink,
  UserInfo,
  SidebarContent,
  ListTabs,
  ListTab,
} from "./styles";
import { MessagesListTab } from "./MessagesListTab";

export const ButtonContainedStyled = styled(ButtonContained)`
  min-width: 160px;

  @media (max-width: 770px) {
    min-width: 150px;
  }
`;
const MesssageSidebar: React.FC = () => {
  const baseUrl = useRouteMatch().path;
  const user_id = "123";
  const user_name = "123";
  const getAvatarUrl = (a) => a;
  const getUserNameByUserId = (a) => a;

  return (
    <SidebarWrapper>
      <SidebarHeader>
        <UserInfo>
          <AvatarWrapperLink to={`/profile/user?id=${user_id}`}>
            <AvatarStyled src={getAvatarUrl(user_id)} alt={user_name} />
          </AvatarWrapperLink>
          <UserNameLink to={`/profile/user?id=${user_id}`}>
            {getUserNameByUserId(user_id)}
          </UserNameLink>
        </UserInfo>
        <ButtonContainedStyled>Compose</ButtonContainedStyled>
      </SidebarHeader>
      <SidebarContent>
        <MessagesListTab />
        <Switch>
          <Route exact path={`${baseUrl}`} component={DirectMessageList} />
          <Route exact path={`${baseUrl}/d`} component={DirectMessageList} />
        </Switch>
      </SidebarContent>
    </SidebarWrapper>
  );
};

export default MesssageSidebar;
