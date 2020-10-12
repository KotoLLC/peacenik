import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
import Button from '@material-ui/core/Button'
import Actions from '@store/actions'
import { getAvatarUrl } from '@services/avatarUrl'
import queryString from 'query-string'
import { history } from '@view/routes'

import {
  UserContentWrapper,
  AvatarWrapper,
  FormWrapper,
  UserNameWrapper,
  AvatarLabel,
} from './styles'

interface Props {
  userName: string
  onGetProfile: () => void
}

const UserProfile: React.FC<Props> = (props) => {
  const { userName } = props
  const url = history.location.search
  const params = queryString.parse(url)
  const userId = params.id ? params.id : ''

  useEffect(() => {
    props.onGetProfile()
    
  }, [props])

  return (
    <UserContentWrapper>
    <AvatarWrapper>
      <AvatarLabel>
        <img src={getAvatarUrl(userId as string)} alt={userName} />
      </AvatarLabel>
    </AvatarWrapper>
    <FormWrapper>
      <UserNameWrapper>
        Name: {userName}
      </UserNameWrapper>
      <Button variant="contained" color="secondary" onClick={() => {/* */}}>Block</Button>
    </FormWrapper>
  </UserContentWrapper>
  )
}

type StateProps = Pick<Props, 'userName'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state),
})

type DispatchProps = Pick<Props, 'onGetProfile'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetProfile: () => dispatch(Actions.profile.getProfileRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)