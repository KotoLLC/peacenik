import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
  useRouteMatch,
} from 'react-router-dom';

import Actions from '@store/actions';
import { FriendsPageTabs } from '@view/features/Friends/components/FriendsPageTabs';
import { ContentWrapper, MessagesWrapper } from '../components/styles';
import MesssageSidebar from '../components/MesssageSidebar';
import DirectMessageBox from '../components/direct/DirectMessageBox';
import GroupMessageBox from '../components/group/GroupMessageBox';
import MesssageNoSelectBox from '../components/MessageNoSelectBox';
import DirectMessageInfoBox from '../components/direct/DirectMessageInfoBox';

interface Props extends RouteComponentProps {}

const MessagesPage: React.FC<Props> = (props) => {
  const baseUrl = useRouteMatch().path;
  return (
    <>
      <FriendsPageTabs />
      <MessagesWrapper>
        <MesssageSidebar />
        <ContentWrapper>
          <Switch>
            <Route
              path={`${baseUrl}/d/:id/info`}
              component={DirectMessageInfoBox}
            />
            <Route path={`${baseUrl}/d/:id`} component={DirectMessageBox} />
            <Route path={`${baseUrl}/g/:id`} component={GroupMessageBox} />
            <Route component={MesssageNoSelectBox} />
          </Switch>
        </ContentWrapper>
      </MessagesWrapper>
    </>
  );
};

export default MessagesPage;
