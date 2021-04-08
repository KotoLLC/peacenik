import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Actions from '@store/actions';
import AllFriendsPage from './AllFriendsPage';
import InvitationsPage from './InvitationsPage';
import InvitionDialog from '../components/InvitionDialog';
import FriendsListTabs from '../components/FriendsListTabs';
import {
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { FriendsPageTabs } from '../components/FriendsPageTabs';
import { FriendsWrapper } from '../components/styles';

interface Props extends RouteComponentProps {
  onGetFriends: () => void;
  onGetInvitations: () => void;
}

const FriendsPages: React.FC<Props> = (props) => {
  const { onGetFriends, onGetInvitations } = props;

  useEffect(() => {
    onGetFriends();
    onGetInvitations();
  }, []);

  return (
    <>
      <FriendsPageTabs />
      <FriendsWrapper>
        <FriendsListTabs />
        <Switch>
          <Route path='/friends' exact component={AllFriendsPage} />
          <Route path='/friends/all' exact component={AllFriendsPage} />
          <Route
            path='/friends/invitations'
            exact
            component={InvitationsPage}
          />
        </Switch>
      </FriendsWrapper>
      <InvitionDialog />
    </>
  );
};

type DispatchProps = Pick<Props, 'onGetFriends' | 'onGetInvitations'>;
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
  onGetInvitations: () => dispatch(Actions.friends.getInvitationsRequest()),
});

export default connect(null, mapDispatchToProps)(withRouter(FriendsPages));
