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
import IconButton from '@material-ui/core/IconButton'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import Tooltip from '@material-ui/core/Tooltip'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from '../../../types'
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
  IconButtonGreen,
} from './styles'

export interface Props {
  invitations: ApiTypes.InvitationFriend[]
  onGetInvitations: () => void
}

interface State {
  filteredInvitations: ApiTypes.InvitationFriend[]
  filterValue: string
}

export class Invitations extends React.Component<Props, State> {

  state = {
    filteredInvitations: [],
    filterValue: '',
  }

  showEmptyListMessage = () => {
    const { filterValue } = this.state

    if (filterValue) {
      return <EmptyMessage>No one's been found.</EmptyMessage>
    } else {
      return <EmptyMessage>You don't have any invitations yet.</EmptyMessage>
    }
  }

  mapInvitations = (invitations: ApiTypes.InvitationFriend[]) => {

    if (!invitations || !invitations.length) {
      return this.showEmptyListMessage()
    }

    return invitations.map(item => {
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
                <UserNoteUnderlined>
                  You have {friends.length} in common</UserNoteUnderlined> : null}
            />
            <Tooltip title={`Accept the invitation`}>
              <IconButtonGreen>
                <CheckCircleIcon />
              </IconButtonGreen>
            </Tooltip>
            <Tooltip title={`Decline the invitation`}>
              <IconButton color="secondary">
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
          <Divider variant="inset" component="li" />
        </div>
      )
    })
  }

  onInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    this.setState({
      filterValue: value,
    })

  }

  setFilteredInvitations = (value: string) => {
    const { invitations } = this.props

    this.setState({
      filteredInvitations: invitations.filter(item => item.user.name.toLowerCase().includes(value.toLowerCase()))
    })
  }

  // componentDidMount() {}

  render() {
    const { invitations } = this.props
    const { filteredInvitations, filterValue } = this.state

    return (
      <>
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
              {this.mapInvitations((filterValue) ? filteredInvitations : invitations)}
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

type StateProps = Pick<Props, 'invitations'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  invitations: [],
})

type DispatchProps = Pick<Props, 'onGetInvitations'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onGetInvitations: () => dispatch(Actions.friends.getFriendsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invitations)