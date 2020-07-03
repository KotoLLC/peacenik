import React, { ChangeEvent } from 'react'
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
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from '../../../types'
import selectors from '@selectors/index'

import {
  SidebarWrapper,
  ContentWrapper,
  ListStyled,
  SearchWrapper,
  SearchIconStyled,
  ContainerTitle,
  EmptyMessage,
  UserName,
} from './styles'

export interface Props {
  friends: ApiTypes.User[]
  onGetFriends: () => void
}

interface State {
  searchValue: string
  searchResult: ApiTypes.User[]
}

class Friends extends React.Component<Props, State> {

  state = {
    searchValue: '',
    searchResult: [],
  }

  showEmptyListMessage = () => {
    const { searchValue } = this.state

    if (searchValue) {
      return <EmptyMessage>No one's been found.</EmptyMessage>
    } else {
      return <EmptyMessage>You don't have any friends yet.</EmptyMessage>
    }
  }

  mapFriends = (friends: ApiTypes.User[]) => {

    if (!friends || !friends.length) {
      return this.showEmptyListMessage()
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

  onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { friends } = this.props
    const { value } = event.currentTarget

    this.setState({
      searchValue: value,
      searchResult: friends.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
    })
  }

  componentDidMount() {
    this.props.onGetFriends()
  }

  render() {
    const { friends } = this.props
    const { searchResult, searchValue } = this.state

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
              {this.mapFriends((searchValue) ? searchResult : friends)}
            </ListStyled>
          </Paper>
        </SidebarWrapper>
        <ContentWrapper>
          <ContainerTitle>Title</ContainerTitle>
          <Divider />
          <List/>
        </ContentWrapper>
      </>
    )
  }
}

type StateProps = Pick<Props, 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 'onGetFriends'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onGetFriends: () => dispatch(Actions.friends.getFriendsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Friends)