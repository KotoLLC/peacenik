import React, { ChangeEvent } from 'react'
import ListItem from '@material-ui/core/ListItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from '../../../types'
import selectors from '@selectors/index'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { capitalizeFirstLetter } from '@services/capitalizeFirstLetter'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import {
  UsersWrapper,
  ContentWrapper,
  ListStyled,
  SearchWrapper,
  SearchIconStyled,
  ContainerTitle,
  EmptyMessage,
  UserName,
  PageWrapper,
  ListItemWrapper,
} from './styles'

export interface Props {
  friends: ApiTypes.Friends.Friend[]
  onGetFriends: () => void
  onAddFriend: (data: ApiTypes.Friends.Request) => void
}

interface State {
  searchValue: string
  searchResult: ApiTypes.Friends.Friend[]
  selectedFriendId: string
  selectedFriendName: string
}

class Friends extends React.Component<Props, State> {

  state = {
    searchValue: '',
    searchResult: [],
    selectedFriendId: '',
    selectedFriendName: '',
  }

  onFriendSelect = (id: string, name: string) => {
    this.setState({
      selectedFriendId: id,
      selectedFriendName: name,
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

  mapPotentialFriendsList = (id: string, friends) => {
    const selectedFriend = friends.find(item => item.user.id === id) || null

    if (!selectedFriend?.friends) {
      return this.showEmptyListMessage()
    }

    return selectedFriend.friends.map(item => {
      const { user, invite_status } = item 

      return (
        <div key={user.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.avatar_thumbnail} />
            </ListItemAvatar>
            <ListItemText primary={<UserName>{user.name}</UserName>}/>
            {this.checkCurrentIcon(user, invite_status)}
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    })
  }

  showEmptyListMessage = () => {
    const { searchValue } = this.state

    if (searchValue) {
      return <EmptyMessage>No one's been found.</EmptyMessage>
    } else {
      return <EmptyMessage>No friends yet.</EmptyMessage>
    }
  }

  mapFriends = (friends: ApiTypes.Friends.Friend[]) => {

    if (!friends || !friends?.length) {
      return this.showEmptyListMessage()
    }

    return friends.map(item => (
      <ListItemWrapper key={item.user.id}>
        <ListItem onClick={() => this.onFriendSelect(item.user.id, item.user.name)}>
          <ListItemAvatar>
            <Avatar alt={item.user.name} src={item.user.avatar_thumbnail} />
          </ListItemAvatar>
          <ListItemText primary={<UserName>{item.user.name}</UserName>} />
        </ListItem>
        <Divider variant="inset" component="li" />
      </ListItemWrapper>
    ))
  }

  onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { friends } = this.props
    const { value } = event.currentTarget

    this.setState({
      searchValue: value,
      searchResult: friends.filter(item => item.user.name.toLowerCase().includes(value.toLowerCase()))
    })
  }

  componentDidMount() {
    this.props.onGetFriends()
  }

  render() {
    const { friends } = this.props
    const { searchResult, searchValue, selectedFriendId, selectedFriendName } = this.state

    return (
      <PageWrapper>
        <UsersWrapper>
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
              {this.mapFriends((searchValue) ? searchResult : friends)}
            </ListStyled>
          </Paper>
        </UsersWrapper>
        <ContentWrapper>
          <ContainerTitle>{(selectedFriendName) ? `${selectedFriendName}\`s common friends` : 'Title'}</ContainerTitle>
          <Divider />
          {selectedFriendId && (this.mapPotentialFriendsList(selectedFriendId, friends))}
        </ContentWrapper>
      </PageWrapper>
    )
  }
}

type StateProps = Pick<Props, 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 'onGetFriends' | 'onAddFriend'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
    onAddFriend: (data: ApiTypes.Friends.Request) => dispatch(Actions.friends.addFriendRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Friends)