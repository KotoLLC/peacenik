import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { StoreTypes, ApiTypes } from 'src/types'
import selectors from '@selectors/index'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import InviteItem from './InviteItem'
import { v4 as uuidv4 } from 'uuid'
import {
  ListStyled,
  SearchInput,
  SearchInputWrapper,
  FriendsEmpty,
  FriendsEmptyWrapper,
  TextUnderlined,
  IconWrapper,
  Text,
} from './styles'

export interface Props {
  invitations: ApiTypes.Friends.Invitation[]
}

interface State {
  pendingInvitations: ApiTypes.Friends.Invitation[]
  searchResult: ApiTypes.Friends.Invitation[]
  searchValue: string
}

export class Invitations extends React.Component<Props, State> {

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

    return (
      <FriendsEmpty>
        <FriendsEmptyWrapper>
          <IconWrapper>
            <PeopleAltRoundedIcon />
          </IconWrapper>
          {
            searchValue ? <Text>No one's been found.</Text> :
              <Text>No friends. You can <TextUnderlined>invite friends</TextUnderlined></Text>
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
        <ListStyled>
          {this.mapInvitations((searchValue) ? searchResult : pendingInvitations)}
        </ListStyled>
      </>
    )
  }
}

type StateProps = Pick<Props, 'invitations'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  invitations: selectors.friends.invitations(state),
})

export default connect(mapStateToProps)(Invitations)