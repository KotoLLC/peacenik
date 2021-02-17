import React from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes } from 'src/types'
import UserProfilePage from './UserProfilePage'

interface Props extends RouteComponentProps {
  myUserId: string
}

const ProfilePage: React.FC<Props> = (props) => {
  return (
    <Switch>
      <Route path="/profile2/user" component={UserProfilePage}/>
    </Switch>
  )
}

type StateProps = Pick<Props, 'myUserId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  myUserId: selectors.profile.userId(state),
})

export default connect(mapStateToProps)(ProfilePage)