import { FriendsList, Props } from './FriendsList'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes } from './../../../types'

type StateProps = Pick<Props, 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: state.friends.friends,
})

type DispatchProps = Pick<Props, 'onGetFriends'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList)
