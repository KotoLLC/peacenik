import React from 'react'
import { WithTopBar } from '@view/shared/WithTopBar'
import Button from '@material-ui/core/Button'
import moment from 'moment'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import ForumIcon from '@material-ui/icons/Forum'
import StorageIcon from '@material-ui/icons/Storage'

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

export const NotificationsPage = React.memo(() => {

  return (
    <WithTopBar>
      <ContainerStyled maxWidth="md">
        <NotificationsWrapper>
          <Header>
            <Title>Notifications</Title>
          </Header>
          <ListWrapper>
            <ListIten>
              <ListDate>{moment('2020-06-28T23:11:57.056-07:00').format('DD MMM YYYY hh:mm a')}</ListDate>
              <ListText className="notice-invite">
                <GroupAddIcon fontSize="small" /> <ListLink>Invite</ListLink>
              </ListText>
            </ListIten>
            <ListIten>
              <ListDate>{moment('2020-06-28T23:11:57.056-07:00').format('DD MMM YYYY hh:mm a')}</ListDate>
              <ListText className="notice-comment">
                <AlternateEmailIcon fontSize="small" /> <ListLink>comment</ListLink>
              </ListText>
            </ListIten>
            <ListIten>
              <ListDate>{moment('2020-06-28T23:11:57.056-07:00').format('DD MMM YYYY hh:mm a')}</ListDate>
              <ListText className="notice-node">
                <StorageIcon fontSize="small" /> <ListLink>node</ListLink>
              </ListText>
            </ListIten>
            <ListIten>
              <ListDate>{moment('2020-06-28T23:11:57.056-07:00').format('DD MMM YYYY hh:mm a')}</ListDate>
              <ListText className="notice-message">
                <ForumIcon fontSize="small" /><ListLink>message</ListLink>
              </ListText>
            </ListIten>
            <ListIten>
              <ListDate>{moment('2020-06-28T23:11:57.056-07:00').format('DD MMM YYYY hh:mm a')}</ListDate>
              <ListText className="notice-like">
                <EmojiPeopleIcon fontSize="small" /> <ListLink>like</ListLink>
              </ListText>
            </ListIten>
          </ListWrapper>
          <Footer>
            <Button variant="contained" color="primary">clear</Button>
          </Footer>
        </NotificationsWrapper>
      </ContainerStyled>
    </WithTopBar>
  )
})