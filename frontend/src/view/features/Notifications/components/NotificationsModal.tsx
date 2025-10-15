import React from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import moment from 'moment'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import selectors from '@selectors/index'
import { ButtonContained } from '@view/shared/styles'
import {
  NotificationsListWrapper,
  NotificationsListHeader,
  NotificationsContent,
  NotificationsIconWrapper,
  NotificationsIconStyled,
  NotificationsText,
  BadgeStyled,
  MenuIconWrapper,
  NewNotifications,
  ClearButtonWrapper,
} from './styles'
import { Notification } from './Notification'

interface Props {
  notifications: ApiTypes.Notifications.Notification[]
  lastKnownIdFromMessageHubs: CommonTypes.NotificationTypes.LastKnown[]
  lastKnownIdFromUserHub: CommonTypes.NotificationTypes.LastKnown | null
  notificationsUnread: ApiTypes.Notifications.Notification[]

  onGetNotifications: () => void
  onCleanNotificationsInUserHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
  onCleanNotificationsInMessageHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
  onMarkAsReadNotificationsInUserHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
  onMarkAsReadNotificationsInMessageHub: (data: CommonTypes.NotificationTypes.LastKnown) => void
}

interface State {
  notifications: ApiTypes.Notifications.Notification[]
  isModalOpen: boolean
  isCheckedNotification: boolean
}

class NotificationsModal extends React.PureComponent<Props, State> {

  state = {
    isModalOpen: false,
    isCheckedNotification: false,
    notifications: this.props.notifications || []
  }

  openModal = (value: boolean) => {
    this.setState({
      isModalOpen: value
    })
  }

  componentDidMount() {
    this.props.onGetNotifications()
  }

  mapNotifiactions = (notifications: ApiTypes.Notifications.Notification[]) => {
    if (notifications.length) {
      return (
        <>
          <ClearButtonWrapper>
            <ButtonContained onClick={this.onClean}>Clear all</ButtonContained>
          </ClearButtonWrapper >
          <NewNotifications>New</NewNotifications>
          {notifications.map(item => (
            <Notification onClick={() => this.openModal(false)} key={item.id} {...item} />
          ))}
        </>
      )
    } else {
      return (
        <div>
          <NotificationsIconWrapper>
            <NotificationsIconStyled />
          </NotificationsIconWrapper>
          <NotificationsText>No notifications yet</NotificationsText>
        </div>
      )
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
        resolve(null)
      }, 700)

    })
  }

  notifyClickHandler = () => {
    this.setState({
      isCheckedNotification: true
    })
    this.openModal(!this.state.isModalOpen)
  }

  render() {
    const { isModalOpen, notifications } = this.state
    const { notificationsUnread } = this.props

    return (
      <ClickAwayListener onClickAway={() => { this.openModal(false) }}>
        <MenuIconWrapper>
          <BadgeStyled
            onClick={this.notifyClickHandler}
            badgeContent={this.state.isCheckedNotification ? 0 : notificationsUnread.length}
            color="secondary"
          >
            <NotificationsActiveIcon />
          </BadgeStyled>
          {isModalOpen &&
            <NotificationsListWrapper>
              <NotificationsListHeader>Notifications</NotificationsListHeader>
              <NotificationsContent>
                {this.mapNotifiactions(notifications)}
              </NotificationsContent>
            </NotificationsListWrapper>
          }
        </MenuIconWrapper>
      </ClickAwayListener>
    )
  }
}

type StateProps = Pick<Props, 'notifications' | 'lastKnownIdFromUserHub' | 'lastKnownIdFromMessageHubs' | 'notificationsUnread'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notifications: selectors.notifications.notifications(state),
  lastKnownIdFromUserHub: selectors.notifications.lastKnownIdFromUserHub(state),
  lastKnownIdFromMessageHubs: selectors.notifications.lastKnownIdFromMessageHubs(state),
  notificationsUnread: selectors.notifications.notificationsUnread(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsModal)