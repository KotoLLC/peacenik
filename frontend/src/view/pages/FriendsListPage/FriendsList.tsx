import React, { ChangeEvent } from 'react'
import { Tabs } from './Tabs'
import TopBar from '@view/shared/TopBar'
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
import { ApiTypes, FriendsTypes } from './../../../types/index'
import {
  PageWrapper,
  Header,
  SidebarWrapper,
  ContentWrapper,
  ListStyled,
  SearchWrapper,
  SearchIconStyled,
  ContainerTitle,
  EmptyFriendsText,
  UserNoteUnderlined,
  UserName,
} from './styles'

export interface Props {
  friends: ApiTypes.User[]
  friendsOfFriends: ApiTypes.FriendsOfFriend[]
  onGetFriends: () => void
  onGetFriendsOfFriends: () => void
}

interface State {
  filteredFriends: ApiTypes.User[]
  filteredFriendsOfFriends: ApiTypes.FriendsOfFriend[]
  filterValue: string
  currentTab: FriendsTypes.CurrentTab
  selectedFriendsOfFriend: ApiTypes.FriendsOfFriend | null
}

export class FriendsList extends React.Component<Props, State> {

  state = {
    filteredFriends: [],
    filteredFriendsOfFriends: [],
    filterValue: '',
    currentTab: 'friends' as FriendsTypes.CurrentTab,
    selectedFriendsOfFriend: null as ApiTypes.FriendsOfFriend | null,
  }

  renderEmptyListMessage = () => {
    const { filterValue, currentTab } = this.state

    if (filterValue) {
      return <EmptyFriendsText>No one's been found.</EmptyFriendsText>
    }

    switch (currentTab) {
      case 'friends': return <EmptyFriendsText>You don't have any friends yet.</EmptyFriendsText>
      case 'friends-of-friends': return <EmptyFriendsText>You don't have any friends of friends yet.</EmptyFriendsText>
      default: return null
    }
  }

  onFriendOfFriendsSelect = (id: string) => {
    const { friendsOfFriends } = this.props

    this.setState({
      selectedFriendsOfFriend: friendsOfFriends.find(item => item.user.id === id) || null
    })
  }

  mapFriends = (friends: ApiTypes.User[]) => {

    if (!friends.length) {
      return this.renderEmptyListMessage()
    }

    return friends.map(item => (
      <div key={item.id}>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={item.name} />
          </ListItemAvatar>
          <ListItemText primary={<UserName>{item.name}</UserName>} />
        </ListItem>
        <Divider variant="inset" component="li" />
      </div>
    ))
  }

  mapFriendsOfFriends = (friendsOfFriends: ApiTypes.FriendsOfFriend[]) => {

    if (!friendsOfFriends.length) {
      return this.renderEmptyListMessage()
    }

    return friendsOfFriends.map(item => {
      const { user, friends } = item
      return (
        <div key={user.id}>
          <ListItem alignItems={friends.length ? 'flex-start' : 'center'}>
            <ListItemAvatar>
              <Avatar alt={user.name} />
            </ListItemAvatar>
            <ListItemText
              primary={<UserName>{user.name}</UserName>}
              secondary={(friends.length) ?
                <UserNoteUnderlined
                  onClick={() => this.onFriendOfFriendsSelect(user.id)}>
                  You have {friends.length} in common</UserNoteUnderlined> : null}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </div>
      )
    })
  }

  onTabSwitch = (value: FriendsTypes.CurrentTab) => {
    this.setState({
      currentTab: value,
      filterValue: '',
      filteredFriends: [],
      selectedFriendsOfFriend: null,
    })
  }

  onInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const { currentTab } = this.state

    this.setState({
      filterValue: value,
    })

    switch (currentTab) {
      case 'friends': this.setFilteredFriends(value); break
      case 'friends-of-friends': this.setFilteredFriendsOfFriends(value); break
      default: return null
    }
  }

  setFilteredFriends = (value: string) => {
    const { friends } = this.props

    this.setState({
      filteredFriends: friends.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
    })
  }

  setFilteredFriendsOfFriends = (value: string) => {
    const { friendsOfFriends } = this.props

    this.setState({
      filteredFriendsOfFriends: friendsOfFriends.filter(item => item.user.name.toLowerCase().includes(value.toLowerCase()))
    })
  }

  mainContent = () => {
    const { selectedFriendsOfFriend } = this.state
    if (!selectedFriendsOfFriend) return null

    const { user, friends } = selectedFriendsOfFriend

    return (
      <>
        <ContainerTitle>{user.name}`s common friends</ContainerTitle>
        <Divider />
        <List>
          {friends.length && friends.map(item => (
            <ListItem key={item.id}>
              <ListItemAvatar>
                <Avatar alt={item.name} />
              </ListItemAvatar>
              <ListItemText primary={<UserName>{item.name}</UserName>} />
            </ListItem>
          ))}
        </List>
      </>
    )

  }

  componentDidMount() {
    this.props.onGetFriends()
    this.props.onGetFriendsOfFriends()
  }

  render() {
    const { friends, friendsOfFriends } = this.props
    const { filteredFriends, filteredFriendsOfFriends, filterValue, currentTab } = this.state

    return (
      <PageWrapper>
        <TopBar />
        <Header>
          <Tabs onTabClick={this.onTabSwitch} />
        </Header>
        <SidebarWrapper>
          <Paper>
            <SearchWrapper>
              <FormControl fullWidth>
                <Input
                  id="filter"
                  placeholder="Filter"
                  onChange={this.onInputValueChange}
                  value={filterValue}
                  startAdornment={<InputAdornment position="start"><SearchIconStyled /></InputAdornment>}
                />
              </FormControl>
            </SearchWrapper>
            <ListStyled>
              {(currentTab === 'friends') && this.mapFriends((filterValue) ? filteredFriends : friends)}
              {(currentTab === 'friends-of-friends') && this.mapFriendsOfFriends((filterValue) ? filteredFriendsOfFriends : friendsOfFriends)}
            </ListStyled>
          </Paper>
        </SidebarWrapper>
        <ContentWrapper>
          {this.mainContent()}
        </ContentWrapper>
      </PageWrapper>
    )
  }
}