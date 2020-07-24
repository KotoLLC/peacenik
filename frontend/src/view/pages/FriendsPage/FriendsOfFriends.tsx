import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from '../../../types'
import ListItem from '@material-ui/core/ListItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { capitalizeFirstLetter } from '@services/capitalizeFirstLetter'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import selectors from '@selectors/index'
import {
  SidebarWrapper,
  ContentWrapper,
  ListStyled,
  SearchWrapper,
  SearchIconStyled,
  ContainerTitle,
  EmptyMessage,
  UserNoteUnderlined,
  UserName,
} from './styles'

export interface Props {
  friendsOfFriends: ApiTypes.Friends.Potential[]
  onGetFriendsOfFriends: () => void
  onAddFriend: (data: ApiTypes.Friends.Request) => void
}

interface State {
  searchValue: string
  searchResult: ApiTypes.Friends.Potential[]
  selectedFriend: ApiTypes.Friends.Potential | null
}

export class FriendsOfFriends extends React.Component<Props, State> {

  state = {
    searchResult: [],
    selectedFriend: null as ApiTypes.Friends.Potential | null,
    searchValue: '',
  }

  showEmptyListMessage = () => {
    const { searchValue } = this.state

    if (searchValue) {
      return <EmptyMessage>No one's been found.</EmptyMessage>
    } else {
      return <EmptyMessage>You don't have any friends of friends yet.</EmptyMessage>
    }
  }

  onFriendSelect = (id: string) => {
    const { friendsOfFriends } = this.props

    this.setState({
      selectedFriend: friendsOfFriends.find(item => item.user.id === id) || null
    })
  }

  checkCurrentIcon = (user: ApiTypes.User, status: ApiTypes.Friends.InvitationStatus) => {
    const { onAddFriend } = this.props

    if (status === 'pending') {
      return (
        <Tooltip title={`Wait for a reply`}>
          <IconButton color="primary">
            <AccessTimeIcon />
          </IconButton>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title={`Add ${capitalizeFirstLetter(user.name)} to friends`}>
          <IconButton color="primary" onClick={() => onAddFriend({ friend: user.id })}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      )
    }
  }

  mapFriendsList = (friendsOfFriends: ApiTypes.Friends.Potential[]) => {
    if (!friendsOfFriends || !friendsOfFriends?.length) {
      return this.showEmptyListMessage()
    }

    return friendsOfFriends.map(item => {
      const { user, friends, invite_status } = item
      return (
        <div key={user.id}>
          <ListItem alignItems={friends?.length ? 'flex-start' : 'center'}>
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.avatar_thumbnail} />
            </ListItemAvatar>
            <ListItemText
              primary={<UserName>{user.name}</UserName>}
              secondary={(friends?.length) ?
                <UserNoteUnderlined
                  onClick={() => this.onFriendSelect(user.id)}>
                  You have {friends?.length} in common</UserNoteUnderlined> : null}
            />
            {this.checkCurrentIcon(user, invite_status)}
          </ListItem>
          <Divider variant="inset" component="li" />
        </div>
      )
    })
  }

  onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { friendsOfFriends } = this.props
    const { value } = event.currentTarget

    this.setState({
      searchValue: value,
      searchResult: friendsOfFriends.filter(item => item.user.name.toLowerCase().includes(value.toLowerCase()))
    })
  }

  componentDidMount() {
    this.props.onGetFriendsOfFriends()
  }

  render() {
    const { friendsOfFriends } = this.props
    const { searchResult, searchValue, selectedFriend } = this.state

    return (
      <>
        <SidebarWrapper>
          <Paper>
            <SearchWrapper>
              <FormControl fullWidth>
                <Input
                  id="filter"
                  placeholder="Filter"
                  onChange={this.onSearch}
                  value={searchValue}
                  startAdornment={<InputAdornment position="start"><SearchIconStyled /></InputAdornment>}
                />
              </FormControl>
            </SearchWrapper>
            <ListStyled>
              {this.mapFriendsList((searchValue) ? searchResult : friendsOfFriends)}
            </ListStyled>
          </Paper>
        </SidebarWrapper>
        <ContentWrapper>
          <ContainerTitle>{(selectedFriend) ? `${selectedFriend.user.name}\`s common friends` : 'Title'}</ContainerTitle>
          <Divider />
          {selectedFriend && (
            <List>
              {selectedFriend.friends?.length && selectedFriend.friends.map(item => (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar alt={item.name}/>
                  </ListItemAvatar>
                  <ListItemText primary={<UserName>{item.name}</UserName>} />
                </ListItem>
              ))}
            </List>
          )}
        </ContentWrapper>
      </>
    )
  }
}

type StateProps = Pick<Props, 'friendsOfFriends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friendsOfFriends: selectors.friends.friendsOfFriends(state),
})

type DispatchProps = Pick<Props, 'onGetFriendsOfFriends' | 'onAddFriend'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetFriendsOfFriends: () => dispatch(Actions.friends.getFriendsOfFriendsRequest()),
  onAddFriend: (data: ApiTypes.Friends.Request) => dispatch(Actions.friends.addFriendRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendsOfFriends)
