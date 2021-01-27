import React, { ChangeEvent } from 'react'
import { connect } from 'react-redux'
import { StoreTypes, ApiTypes } from 'src/types'
import selectors from '@selectors/index'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import { FriendItem } from './FriendItem'
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
} from './styles'

export interface Props {
  friends: ApiTypes.Friends.Friend[]
}

interface State {
  searchValue: string
  searchResult: ApiTypes.Friends.Friend[]
}

class Friends extends React.Component<Props, State> {

  state = {
    searchValue: '',
    searchResult: [],
  }

  searchInputRef = React.createRef<HTMLInputElement>()

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

  mapFriends = (friends: ApiTypes.Friends.Friend[]) => {

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

    this.setState({
      searchValue: value,
      searchResult: friends.filter(item => item.user.name.toLowerCase().includes(value.toLowerCase()))
    })
  }

  render() {
    const { friends } = this.props
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
        <ButtonContained className="mobile-empty desktop-none">Invite friends</ButtonContained>
        {this.mapFriends((searchValue) ? searchResult : friends)}
      </>
    )
  }
}

type StateProps = Pick<Props, 'friends'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  friends: selectors.friends.friends(state),
})

export default connect(mapStateToProps)(Friends)