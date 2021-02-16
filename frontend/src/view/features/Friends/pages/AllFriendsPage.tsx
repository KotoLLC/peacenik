import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { StoreTypes, ApiTypes } from 'src/types'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import { FriendItem } from '../components/FriendItem'
import { v4 as uuidv4 } from 'uuid'
import { ButtonContained } from '@view/shared/styles'
import {
  FriendsEmpty,
  FriendsEmptyWrapper,
  TextUnderlined,
  IconWrapper,
  Text,
  SearchInput,
  SearchInputWrapper,
} from '../components/styles'

export interface Props {
  friends: ApiTypes.Friends.Friend[] | null
  onOpenInvitationsDialog: (value: boolean) => void
}

interface State {
  searchValue: string
  searchResult: ApiTypes.Friends.Friend[]
}

class AllFriendsPage extends React.Component<Props, State> {

  state = {
    searchValue: '',
    searchResult: [],
  }

  searchInputRef = React.createRef<HTMLInputElement>()

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

  mapFriends = (friends: ApiTypes.Friends.Friend[] | null) => {

    if (!friends || !friends?.length) {
      return this.showEmptyListMessage()
    }

    return friends.map(item => (
      <FriendItem
        name={item.user.name}
        fullName={item.user.full_name}
        id={item.user.id}
        key={uuidv4()} />
    ))
  }

  onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { friends } = this.props
    const { value } = event.currentTarget

    let result: ApiTypes.Friends.Friend[] = []

    if (friends === null) {
      result = friends!.filter(item => item.user.name.toLowerCase().includes(value.toLowerCase()))
    }

    this.setState({
      searchValue: value,
      searchResult: result
    })
  }

  render() {
    const { friends, onOpenInvitationsDialog } = this.props
    const { searchResult, searchValue } = this.state

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
        <ButtonContained 
          className="mobile-only desktop-none"
          onClick={() => onOpenInvitationsDialog(true)}>
            Invite friends
          </ButtonContained>
        {this.mapFriends((searchValue) ? searchResult : friends)}
      </>
    )
  }
}

type StateProps = Pick<Props, 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: selectors.friends.friends(state),
})

type DispatchProps = Pick<Props, 'onOpenInvitationsDialog'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onOpenInvitationsDialog: (value: boolean) => dispatch(Actions.friends.openInvitationsDialog(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(AllFriendsPage)