import React, { useCallback, useState } from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import { ButtonContained } from "@view/shared/styles";
import DirectMessageList from "./direct/DirectMessageList";
import {
  SidebarWrapper,
  SidebarContent,
  MessagesListContent,
  SidebarFooter,
} from "./styles";

import { DirectMessageDialog } from "./direct/DirectMessageDialog";

export const ButtonContainedStyled = styled(ButtonContained)`
  min-width: 160px;
  margin-right: 0;

  @media (max-width: 770px) {
    min-width: auto;
    width: 80px;
  }
`;
const MesssageSidebar: React.FC = () => {
  const baseUrl = useRouteMatch().path;

  const [isComposeDlgOpen, setIsComposeDlgOpen] = useState<boolean>(false);
  const handleSelectChatUser = useCallback((id: string) => {
    console.log(`id ${id}`);
    setIsComposeDlgOpen(false);
  }, []);

  return (
    <SidebarWrapper>
      <SidebarContent>
        <MessagesListContent>
          <Switch>
            <Route path={`${baseUrl}/d`} component={DirectMessageList} />
            <Redirect to={`${baseUrl}/d`} />
          </Switch>
        </MessagesListContent>
      </SidebarContent>
      <SidebarFooter>
        <ButtonContainedStyled onClick={() => setIsComposeDlgOpen(true)}>
          Compose
        </ButtonContainedStyled>
      </SidebarFooter>
      <DirectMessageDialog
        isOpenModal={isComposeDlgOpen}
        setOpenDialog={setIsComposeDlgOpen}
        className="compose_modal"
        onChatOpen={handleSelectChatUser}
      />
    </SidebarWrapper>
  );
};

export default MesssageSidebar;
