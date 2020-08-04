import React from 'react'
import { WithTopBar } from '@view/shared/WithTopBar'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import ForumIcon from '@material-ui/icons/Forum'
import StorageIcon from '@material-ui/icons/Storage'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from './../../../types'
import selectors from '@selectors/index'

import {
  ContainerStyled,
  NotificationsWrapper,
  Header,
  Title,
  Footer,
  ListWrapper,
  ListIten,
  ListDate,
  ListText,
  ListLink,
} from './styles'

interface Props {
  notifications: ApiTypes.Notifications.Notification[]
  onGetNotifications: () => void
}

class NotificationsPage extends React.PureComponent<Props> {

  componentDidMount() {
    this.props.onGetNotifications()
  }

  checkCurrentIcon = (type: ApiTypes.Notifications.Type) => {
    if (type.indexOf('message') !== -1) {
      return <ForumIcon fontSize="small" />
    }

    if (type.indexOf('comment') !== -1) {
      return <AlternateEmailIcon fontSize="small" />
    }

    if (type.indexOf('node') !== -1) {
      return <StorageIcon fontSize="small" />
    }

    if (type.indexOf('invite') !== -1) {
      return <GroupAddIcon fontSize="small" />
    }
  }

  mapNotifiactions = () => {
    const { notifications } = this.props

    return notifications.map(item => (
      <ListIten key={item.id}>
        <ListDate>{moment(item.created_at).format('DD MMM YYYY hh:mm a')}</ListDate>
        <ListText>
          {this.checkCurrentIcon(item.type)}
          <ListLink>{item.text}</ListLink>
        </ListText>
      </ListIten>
    ))
  }

  render() {
    return (
      <WithTopBar>
        <ContainerStyled >
          <NotificationsWrapper>
            <Header>
              <Title>Notifications</Title>
            </Header>
            <ListWrapper>
              {this.mapNotifiactions()}
            </ListWrapper>
            <Footer>
              <Button variant="contained" color="primary">clear</Button>
            </Footer>
          </NotificationsWrapper>
        </ContainerStyled>
      </WithTopBar>
    )
  }
}

type StateProps = Pick<Props, 'notifications'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notifications: selectors.notifications.notifications(state),
})

type DispatchProps = Pick<Props, 'onGetNotifications'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetNotifications: () => dispatch(Actions.notifications.getNotificationsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage)