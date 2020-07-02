import { FriendsList, Props } from './FriendsList'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from './../../../types'

type StateProps = Pick<Props, 'friends' | 'friendsOfFriends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: state.friends.friends,
  friendsOfFriends: state.friends.friendsOfFriends,
})

type DispatchProps = Pick<Props, 'onGetFriends' | 'onGetFriendsOfFriends' | 'onAddFriend'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
    onGetFriendsOfFriends: () => dispatch(Actions.friends.getFriendsOfFriendsRequest()),
    onAddFriend: (data: ApiTypes.FriendRequest) => dispatch(Actions.friends.addFriendRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList)
