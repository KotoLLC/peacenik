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
  MessagesContentWrapper,
  MessagesSideBarWrapper,
  MessagesWrapper,
} from "../components/styles";
import MesssageSidebar from "../components/MesssageSidebar";
import DriectMessageBox from "../components/DriectMessageBox";
import GroupMessageBox from "../components/GroupMessageBox";
import MesssageNoSelectBox from "../components/MesssageNoSelectBox";

interface Props extends RouteComponentProps {
  onGetFriends: () => void;
  onGetInvitations: () => void;
}

const MessagesPage: React.FC<Props> = (props) => {
  const baseUrl = useRouteMatch().path;
  console.log(baseUrl);

  return (
    <>
      <FriendsPageTabs />
      <MessagesWrapper>
        <MessagesSideBarWrapper>
          <MesssageSidebar />
        </MessagesSideBarWrapper>
        <MessagesContentWrapper>
          <Switch>
            <Route path={`${baseUrl}/d`} component={DriectMessageBox} />
            <Route path={`${baseUrl}/g`} component={GroupMessageBox} />
            <Route component={MesssageNoSelectBox} />
          </Switch>
        </MessagesContentWrapper>
      </MessagesWrapper>
    </>
  );
};

type DispatchProps = Pick<Props, "onGetFriends" | "onGetInvitations">;
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
  onGetInvitations: () => dispatch(Actions.friends.getInvitationsRequest()),
});

export default connect(null, mapDispatchToProps)(withRouter(MessagesPage));
