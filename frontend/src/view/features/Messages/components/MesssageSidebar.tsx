import React, { useState } from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import { ButtonContained } from "@view/shared/styles";
import DirectMessageList from "./DirectMessageList";
import {
  UserAvatarStyled,
  AvatarWrapperLink,
  SidebarHeader,
  SidebarWrapper,
  UserNameLink,
  MessageInfo,
  SidebarContent,
  ListTabs,
  ListTab,
  MessagesListContent,
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
        <MessageInfo>
          <AvatarWrapperLink to={`/profile/user?id=${user_id}`}>
            <UserAvatarStyled src={getAvatarUrl(user_id)} alt={user_name} />
          </AvatarWrapperLink>
          <UserNameLink to={`/profile/user?id=${user_id}`}>
            {getUserNameByUserId(user_id)}
          </UserNameLink>
        </MessageInfo>
        <ButtonContainedStyled>Compose</ButtonContainedStyled>
      </SidebarHeader>
      <SidebarContent>
        <MessagesListTab />
        <MessagesListContent>
          <Switch>
            <Route exact path={`${baseUrl}`} component={DirectMessageList} />
            <Route path={`${baseUrl}/d`} component={DirectMessageList} />
          </Switch>
        </MessagesListContent>
      </SidebarContent>
    </SidebarWrapper>
  );
};

export default MesssageSidebar;
