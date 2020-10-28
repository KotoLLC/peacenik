import React from 'react'
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
import { WithTopBar } from '@view/shared/WithTopBar'
import MyProfile from './MyProfile'
import UserProfile from './UserProfile'
import queryString from 'query-string'

import {
  ContainerStyled,
} from './styles'

interface Props extends RouteComponentProps {
  myUserId: string
}

const ProfilePage: React.FC<Props> = (props) => {
  const { myUserId } = props
  const url = props.location.search
  const params = queryString.parse(url)
  const currentUserId = params.id ? params.id : ''

  return (
    <WithTopBar>
      <ContainerStyled>
        <Switch>
          <Route path="/profile/me" exact component={MyProfile} />
          <Route path="/profile/user">
            {(myUserId === currentUserId) ? <Redirect to="/profile/me" /> : <UserProfile />}
          </Route>
        </Switch>
      </ContainerStyled>
    </WithTopBar>
  )
}

type StateProps = Pick<Props, 'myUserId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  myUserId: selectors.profile.userId(state),
})

export default connect(mapStateToProps)(ProfilePage)