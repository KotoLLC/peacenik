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
import FavoriteIcon from '@material-ui/icons/Favorite'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
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
  lastKnownIdFromNodes: CommonTypes.NotificationTypes.LastKnown[]
  lastKnownIdFromCentral: CommonTypes.NotificationTypes.LastKnown | null
  onGetNotifications: () => void
  onCleanNotificationsInCentral: (data: CommonTypes.NotificationTypes.LastKnown) => void
  onCleanNotificationsInNode: (data: CommonTypes.NotificationTypes.LastKnown) => void
}

interface State {
  notifications: ApiTypes.Notifications.Notification[]
}

class NotificationsPage extends React.PureComponent<Props> {

  state = {
    notifications: this.props.notifications || []
  }

  componentDidMount() {
    this.props.onGetNotifications()
  }

  checkCurrentIcon = (item: ApiTypes.Notifications.Notification) => {
    const { text, type, data } = item

    let urlVars = `?type=${type}`
    const dataObj = JSON.parse(data as any) // tslint:disable-line

    Object.entries(dataObj).forEach(
      ([key, value]) => {
        urlVars += `&${key}=${value}`
      }
    )

    if (type.indexOf('message') !== -1) {
      return (
        <ListText>
          {(type === 'message/like') ? <FavoriteIcon fontSize="small"/> : <ForumIcon fontSize="small" />}
          <ListLink to={`/messages${urlVars}`}>{text}</ListLink>
        </ListText>
      )
    }

    if (type.indexOf('comment') !== -1) {
      return (
        <ListText>
          {(type === 'comment/like') ? <FavoriteIcon fontSize="small"/> : <AlternateEmailIcon fontSize="small" />}
          <ListLink to={`/messages${urlVars}`}>{text}</ListLink>
        </ListText>
      )
    }

    if (type.indexOf('node') !== -1) {
      return (
        <ListText>
          <StorageIcon fontSize="small" />
          <ListLink to={`/nodes/list${urlVars}`}>{text}</ListLink>
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
    return notifications.map(item => (
      <ListIten key={item.id}>
        <ListDate>{moment(item.created_at).format('DD MMM YYYY hh:mm a')}</ListDate>
        {this.checkCurrentIcon(item)}
      </ListIten>
    ))
  }

  static getDerivedStateFromProps(newProps: Props, prevState: State) {
    const sortByDate = (data: ApiTypes.Notifications.Notification[]) => {
      return data.sort((b, a) => {
        return moment(b.created_at).diff(a.created_at)
      })
    }

    if (newProps.notifications?.length) return {
      notifications: sortByDate(newProps.notifications)
    }

    return  {
      notifications: []
    }
  }

  onClean = () => {
    const { 
      lastKnownIdFromNodes, 
      lastKnownIdFromCentral, 
      onCleanNotificationsInCentral,
      onCleanNotificationsInNode,
     } = this.props
    
    if (lastKnownIdFromCentral) {
      onCleanNotificationsInCentral(lastKnownIdFromCentral)
    } 

    if (lastKnownIdFromNodes.length) {
      lastKnownIdFromNodes.forEach(item => {
        onCleanNotificationsInNode(item)
      })
    }
  }

  render() {
    const { notifications } = this.state

    return (
      <WithTopBar>
        <ContainerStyled >
          <NotificationsWrapper>
            <Header>
              <Title>Notifications</Title>
            </Header>
            <ListWrapper>
              {this.mapNotifiactions(notifications)}
            </ListWrapper>
            <Footer>
              <Button 
                variant="contained" 
                color="primary"
                onClick={this.onClean}
                >clear</Button>
            </Footer>
          </NotificationsWrapper>
        </ContainerStyled>
      </WithTopBar>
    )
  }
}

type StateProps = Pick<Props, 'notifications' |'lastKnownIdFromCentral' | 'lastKnownIdFromNodes'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  notifications: selectors.notifications.notifications(state),
  lastKnownIdFromCentral: selectors.notifications.lastKnownIdFromCentral(state),
  lastKnownIdFromNodes: selectors.notifications.lastKnownIdFromNodes(state),
})

type DispatchProps = Pick<Props, 'onGetNotifications' | 'onCleanNotificationsInCentral' | 'onCleanNotificationsInNode'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetNotifications: () => dispatch(Actions.notifications.getNotificationsRequest()),
  onCleanNotificationsInCentral: (data: CommonTypes.NotificationTypes.LastKnown) => 
          dispatch(Actions.notifications.cleanNotificationsInCentralRequest(data)),
  onCleanNotificationsInNode: (data: CommonTypes.NotificationTypes.LastKnown) => 
          dispatch(Actions.notifications.cleanNotificationsInNodeRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage)