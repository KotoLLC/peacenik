import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import Actions from '@store/actions'
import { getAvatarUrl } from '@services/avatarUrl'
import queryString from 'query-string'
import { history } from '@view/routes'
import BlockUserDialog from './BlockUserDialog'

import {
  UserContentWrapper,
  AvatarWrapper,
  FormWrapper,
  UserNameWrapper,
  AvatarLabel,
} from './styles'

interface Props {
  userName: string
  users: ApiTypes.User[]

  onGetUser: (value: string) => void
}

const UserProfile: React.FC<Props> = (props) => {
  const { userName, onGetUser, users } = props
  const url = history.location.search
  const params = queryString.parse(url)
  const userId = params.id ? params.id : ''

  useEffect(() => {
    onGetUser(userId as string)
  }, [props, users, onGetUser, userId])

  return (
    <UserContentWrapper>
    <AvatarWrapper>
      <AvatarLabel>
        <img src={getAvatarUrl(userId as string)} alt={userName} />
      </AvatarLabel>
    </AvatarWrapper>
    <FormWrapper>
      <UserNameWrapper>
        Name: {(users[0]?.name) ? users[0]?.name : ''}
      </UserNameWrapper>
      <BlockUserDialog userId={userId as string}/>
    </FormWrapper>
  </UserContentWrapper>
  )
}

type StateProps = Pick<Props, 'userName' | 'users'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state),
  users: selectors.profile.users(state),
})

type DispatchProps = Pick<Props, 'onGetUser'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetUser: (value: string) => dispatch(Actions.profile.getUsersRequest([value])),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)