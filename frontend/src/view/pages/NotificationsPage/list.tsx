import React from 'react'
import moment from 'moment'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import ForumIcon from '@material-ui/icons/Forum'
import StorageIcon from '@material-ui/icons/Storage'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import selectors from '@selectors/index'
import PullToRefresh from 'react-simple-pull-to-refresh'
import CircularProgress from '@material-ui/core/CircularProgress'

import {
  Header,
  Title,
  NoNotificationsText,
  ListWrapper,
  ListIten,
  ListDate,
  ListText,
  ListLink,
  NotificationsWrapper,
  ContainerStyled,
} from './styles'

interface Props {
  notifications: ApiTypes.Notifications.Notification[]
  lastKnownIdFromMessageHubs: CommonTypes.NotificationTypes.LastKnown[]
  lastKnownIdFromUserHub: CommonTypes.NotificationTypes.LastKnown | null

  onGetNotifications: () => void
  onCleanNotificationsInUserHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
  onCleanNotificationsInMessageHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
  onMarkAsReadNotificationsInUserHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
  onMarkAsReadNotificationsInMessageHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
}

interface State {
  notifications: ApiTypes.Notifications.Notification[]
}

class NotificationsList extends React.PureComponent<Props, State> {

  state = {
    notifications: this.props.notifications || []
  }

  componentDidMount() {
    this.props.onGetNotifications()
  }

  checkCurrentIcon = (item: ApiTypes.Notifications.Notification) => {
    const { text, type, data, messageToken, sourceHost } = item

    let urlVars = `?type=${type}`

    const dataObj = JSON.parse(data as any) // tslint:disable-line

    dataObj.messageToken = messageToken
    dataObj.sourceHost = sourceHost

    Object.entries(dataObj).forEach(
      ([key, value]) => {
        urlVars += `&${key}=${value}`
      }
    )

    if (type.indexOf('message-hub') !== -1) {
      return (
        <ListText>
          <StorageIcon fontSize="small" />
          <ListLink to={`/hubs/list${urlVars}`}>{text}</ListLink>
        </ListText>
      )
    }

    if (type.indexOf('message') !== -1) {
      return (
        <ListText>
          {(type === 'message/like') ? <FavoriteIcon fontSize="small" /> : <ForumIcon fontSize="small" />}
          <ListLink to={`/notifications/info${urlVars}`}>{text}</ListLink>
        </ListText>
      )
    }

    if (type.indexOf('comment') !== -1) {
      return (
        <ListText>
          {(type === 'comment/like') ? <FavoriteIcon fontSize="small" /> : <AlternateEmailIcon fontSize="small" />}
          <ListLink to={`/notifications/info${urlVars}`}>{text}</ListLink>
        </ListText>
      )
    }

    if (type.indexOf('invite') !== -1) {

      let currentUrl = '/friends/all'

      if (type === 'invite/add' || type === 'invite/reject') {
        currentUrl = '/friends/invitations'
      }

      return (
        <ListText>
          <GroupAddIcon fontSize="small" />
          <ListLink to={currentUrl}>{text}</ListLink>
        </ListText>
      )
    }
  }

  mapNotifiactions = (notifications: ApiTypes.Notifications.Notification[]) => {
    if (notifications.length) {
      return notifications.map(item => (
        <ListIten key={item.id} className={Boolean(item.read_at) ? 'read' : ''}>
          <ListDate>{moment(item.created_at).format('DD MMM YYYY hh:mm a')}</ListDate>
          {this.checkCurrentIcon(item)}
        </ListIten>
      ))
    } else {
      return <NoNotificationsText>No new notifications</NoNotificationsText>
    }
  }

  static getDerivedStateFromProps(newProps: Props) {
    const sortByDate = (data: ApiTypes.Notifications.Notification[]) => {
      return data.sort((b, a) => {
        return moment(b.created_at).diff(a.created_at)
      })
    }

    if (newProps.notifications?.length) return {
      notifications: sortByDate(newProps.notifications)
    }

    return {
      notifications: []
    }
  }

  componentWillUnmount() {
    // this.markAsReadNotification()
    // this.onClean()
  }

  onClean = () => {
    const {
      lastKnownIdFromMessageHubs,
      lastKnownIdFromUserHub,
      onCleanNotificationsInUserHub,
      onCleanNotificationsInMessageHub,
    } = this.props

    if (lastKnownIdFromUserHub) {
      onCleanNotificationsInUserHub(lastKnownIdFromUserHub)
    }

    if (lastKnownIdFromMessageHubs.length) {
      lastKnownIdFromMessageHubs.forEach(item => {
        onCleanNotificationsInMessageHub(item)
      })
    }
  }

  markAsReadNotification = () => {
    const {
      lastKnownIdFromMessageHubs,
      lastKnownIdFromUserHub,
      onMarkAsReadNotificationsInUserHub,
      onMarkAsReadNotificationsInMessageHub,
    } = this.props

    if (lastKnownIdFromUserHub) {
      onMarkAsReadNotificationsInUserHub(lastKnownIdFromUserHub)
    }

    if (lastKnownIdFromMessageHubs.length) {
      lastKnownIdFromMessageHubs.forEach(item => {
        onMarkAsReadNotificationsInMessageHub(item)
      })
    }
  }

  onRefresh = () => {
    return new Promise((resolve, reject) => {

      this.props.onGetNotifications()
      setTimeout(() => {
        resolve()
      }, 700)

    })
  }

  render() {
    const { notifications } = this.state

    return (

      <PullToRefresh
        onRefresh={this.onRefresh}
        refreshingContent={<CircularProgress />}
      >
        <ContainerStyled>
          <NotificationsWrapper>
            <Header>
              <Title>Notifications</Title>
            </Header>
            <ListWrapper>
              {this.mapNotifiactions(notifications)}
            </ListWrapper>
          </NotificationsWrapper>
        </ContainerStyled>
      </PullToRefresh>
    )
  }
}

type StateProps = Pick<Props, 'notifications' | 'lastKnownIdFromUserHub' | 'lastKnownIdFromMessageHubs'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notifications: selectors.notifications.notifications(state),
  lastKnownIdFromUserHub: selectors.notifications.lastKnownIdFromUserHub(state),
  lastKnownIdFromMessageHubs: selectors.notifications.lastKnownIdFromMessageHubs(state),
})

type DispatchProps = Pick<Props,
  | 'onGetNotifications'
  | 'onCleanNotificationsInUserHub'
  | 'onCleanNotificationsInMessageHub'
  | 'onMarkAsReadNotificationsInUserHub'
  | 'onMarkAsReadNotificationsInMessageHub'
>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetNotifications: () => dispatch(Actions.notifications.getNotificationsRequest()),
  onCleanNotificationsInUserHub: (data: CommonTypes.NotificationTypes.LastKnown) =>
    dispatch(Actions.notifications.cleanNotificationsInUserHubRequest(data)),
  onCleanNotificationsInMessageHub: (data: CommonTypes.NotificationTypes.LastKnown) =>
    dispatch(Actions.notifications.cleanNotificationsInHubRequest(data)),
  onMarkAsReadNotificationsInUserHub: (data: CommonTypes.NotificationTypes.LastKnown) =>
    dispatch(Actions.notifications.markAsReadNotificationsInUserHubRequest(data)),
  onMarkAsReadNotificationsInMessageHub: (data: CommonTypes.NotificationTypes.LastKnown) =>
    dispatch(Actions.notifications.markAsReadNotificationsInHubRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList)