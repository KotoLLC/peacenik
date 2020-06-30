import { FriendsList, Props } from './FriendsList'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes } from './../../../types'

type StateProps = Pick<Props, 'friends' | 'friendsOfFriends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: state.friends.friends,
  friendsOfFriends: state.friends.friendsOfFriends,
})

type DispatchProps = Pick<Props, 'onGetFriends' | 'onGetFriendsOfFriends'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
    onGetFriendsOfFriends: () => dispatch(Actions.friends.getFriendsOfFriendsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList)
