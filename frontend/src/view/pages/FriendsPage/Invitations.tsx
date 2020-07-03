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
  IconButtonGreen,
} from './styles'

export interface Props {
  invitations: ApiTypes.Invitation[]
  onGetInvitations: () => void
  onAcceptInvitation: (data: ApiTypes.AcceptInvitation) => void
}

interface State {
  pendingInvitations: ApiTypes.Invitation[]
  searchResult: ApiTypes.Invitation[]
  searchValue: string
}

export class Invitations extends React.Component<Props, State> {

  state = {
    searchResult: [],
    searchValue: '',
    pendingInvitations: [],
  }

  static getDerivedStateFromProps(newProps: Props) {
    return {
      pendingInvitations: newProps.invitations.length && newProps.invitations.filter(item => (!item.accepted_at))
    }
  }

  showEmptyListMessage = () => {
    const { searchValue } = this.state

    if (searchValue) {
      return <EmptyMessage>No one's been found.</EmptyMessage>
    } else {
      return <EmptyMessage>You don't have any invitations yet.</EmptyMessage>
    }
  }

  mapInvitations = (invitations: ApiTypes.Invitation[]) => {
    const { onAcceptInvitation } = this.props

    if (!invitations || !invitations.length) {
      return this.showEmptyListMessage()
    }

    return invitations.map(item => {
      const { friend_id, friend_name } = item
      return (
        <div key={friend_id}>
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar alt={friend_name} />
            </ListItemAvatar>
            <ListItemText primary={<UserName>{friend_name}</UserName>} />
            <Tooltip title={`Accept the invitation`}>
              <IconButtonGreen onClick={() => onAcceptInvitation({inviter_id: friend_id})}>
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

  onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { pendingInvitations } = this.state
    const { value } = event.currentTarget

    this.setState({
      searchValue: value,
      searchResult: pendingInvitations.filter(
        (item: ApiTypes.Invitation) => {
          return item.friend_name.toLowerCase().includes(value.toLowerCase())
        }
      )
    })
  }

  componentDidMount() {
    this.props.onGetInvitations()
  }

  render() {
    const { pendingInvitations, searchResult, searchValue } = this.state

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
              {this.mapInvitations((searchValue) ? searchResult : pendingInvitations)}
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
  invitations: selectors.friends.invitations(state),
})

type DispatchProps = Pick<Props, 'onGetInvitations' | 'onAcceptInvitation'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onGetInvitations: () => dispatch(Actions.friends.getInvitationsRequest()),
    onAcceptInvitation: (data: ApiTypes.AcceptInvitation) => dispatch(Actions.friends.acceptInvitationRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invitations)