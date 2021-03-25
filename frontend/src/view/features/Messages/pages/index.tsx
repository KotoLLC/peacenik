import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
  useRouteMatch,
} from "react-router-dom";

import Actions from "@store/actions";
import { FriendsPageTabs } from "@view/features/Friends/components/FriendsPageTabs";
import {
  ContentWrapper,
  SideBarWrapper,
  MessagesWrapper,
} from "../components/styles";
import MesssageSidebar from "../components/MesssageSidebar";
import DriectMessageBox from "../components/DriectMessageBox";
import GroupMessageBox from "../components/GroupMessageBox";
import MesssageNoSelectBox from "../components/MessageNoSelectBox";

interface Props extends RouteComponentProps {}

const MessagesPage: React.FC<Props> = (props) => {
  const baseUrl = useRouteMatch().path;
  return (
    <>
      <FriendsPageTabs />
      <MessagesWrapper>
        <SideBarWrapper>
          <MesssageSidebar />
        </SideBarWrapper>
        <ContentWrapper>
          <Switch>
            <Route path={`${baseUrl}/d/:slug`} component={DriectMessageBox} />
            <Route path={`${baseUrl}/g/:slug`} component={GroupMessageBox} />
            <Route component={MesssageNoSelectBox} />
          </Switch>
        </ContentWrapper>
      </MessagesWrapper>
    </>
  );
};

export default MessagesPage;
