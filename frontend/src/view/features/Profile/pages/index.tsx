import React from 'react'
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
import UserProfilePage from './UserProfilePage'
import MyProfile from '@view/pages/_legacycode/ProfilePage/MyProfile'
import queryString from 'query-string'

interface Props extends RouteComponentProps {
  myUserId: string
}

const ProfilePage: React.FC<Props> = (props) => {
  const { myUserId } = props
  const url = props.location.search
  const params = queryString.parse(url)
  const currentUserId = params.id ? params.id : ''

  return (
    <Switch>
      <Route path="/profile/user">
        <UserProfilePage isUser={(myUserId === currentUserId)}/>
        {/* {(myUserId === currentUserId) ? <Redirect to="/settings" /> : <UserProfilePage />} */}
      </Route>
    </Switch>
  )
}

type StateProps = Pick<Props, 'myUserId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  myUserId: selectors.profile.userId(state),
})

export default connect(mapStateToProps)(ProfilePage)