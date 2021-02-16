import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { StoreTypes, ApiTypes } from 'src/types'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import InviteItem from './../components/InviteItem'
import { v4 as uuidv4 } from 'uuid'
import {
  SearchInput,
  SearchInputWrapper,
  FriendsEmpty,
  FriendsEmptyWrapper,
  TextUnderlined,
  IconWrapper,
  Text,
} from '../components/styles'

export interface Props {
  invitations: ApiTypes.Friends.Invitation[]
  onOpenInvitationsDialog: (value: boolean) => void
}

interface State {
  pendingInvitations: ApiTypes.Friends.Invitation[]
  searchResult: ApiTypes.Friends.Invitation[]
  searchValue: string
}

export class InvitationsPage extends React.Component<Props, State> {

  state = {
    searchResult: [],
    searchValue: '',
    pendingInvitations: [],
  }

  searchInputRef = React.createRef<HTMLInputElement>()

  static getDerivedStateFromProps(newProps: Props) {
    return {
      pendingInvitations: newProps.invitations?.length && newProps.invitations.filter(
        item => !item.accepted_at && !item.rejected_at
      )
    }
  }

  showEmptyListMessage = () => {
    const { searchValue } = this.state
    const { onOpenInvitationsDialog } = this.props

    return (
      <FriendsEmpty>
        <FriendsEmptyWrapper>
          <IconWrapper>
            <PeopleAltRoundedIcon />
          </IconWrapper>
          {
            searchValue ? <Text>No one's been found.</Text> :
              <Text>No friends. You can <TextUnderlined onClick={() => onOpenInvitationsDialog(true)}>
              invite friends</TextUnderlined>
              </Text>
          }
        </FriendsEmptyWrapper>
      </FriendsEmpty>
    )
  }

  mapInvitations = (invitations: ApiTypes.Friends.Invitation[]) => {
    if (!invitations || !invitations?.length) {
      return this.showEmptyListMessage()
    }

    return invitations.map(item => (
      <InviteItem
        name={item.friend_name}
        fullName={item.friend_full_name}
        id={item.friend_id}
        key={uuidv4()} 
      />
    ))
  }

  onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { pendingInvitations } = this.state
    const { value } = event.currentTarget

    this.setState({
      searchValue: value,
      searchResult: pendingInvitations.filter(
        (item: ApiTypes.Friends.Invitation) => {
          return item.friend_name.toLowerCase().includes(value.toLowerCase())
        }
      )
    })
  }

  render() {
    const { pendingInvitations, searchResult, searchValue } = this.state

    return (
      <>
        <SearchInputWrapper>
          <SearchInput
            id="outlined-adornment-amount"
            ref={this.searchInputRef}
            placeholder="Filter"
            onChange={this.onSearch}
            value={searchValue}
            startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
          />
        </SearchInputWrapper>
        {this.mapInvitations((searchValue) ? searchResult : pendingInvitations)}
      </>
    )
  }
}

type StateProps = Pick<Props, 'invitations'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  invitations: selectors.friends.invitations(state),
})

type DispatchProps = Pick<Props, 'onOpenInvitationsDialog'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onOpenInvitationsDialog: (value: boolean) => dispatch(Actions.friends.openInvitationsDialog(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(InvitationsPage)