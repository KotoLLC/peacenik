import React from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import DeckIcon from '@material-ui/icons/Deck'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Divider from '@material-ui/core/Divider'
import { getAvatarUrl } from '@services/avatarUrl'
import {
  GroupPublicity,
  RightButton,
  GroupDetailsWrapper,
  UsersListWrapper,
  ListTitle,
} from './styles'
import {
  UserName,
  UserNameLink,
  AvatarStyled,
  ListStyled,
  ContainerTitle,
} from '@view/pages/FriendsPage/styles'

interface Props extends RouteComponentProps { }

export const GroupDetailsPage: React.FC<Props> = (props) => {
  const { history } = props

  return (
    <>
      <GroupDetailsWrapper>
        <div>
          <GroupPublicity>Public</GroupPublicity>
        </div>
        <RightButton
          variant="contained"
          color="secondary"
        >Leave</RightButton>
      </GroupDetailsWrapper>
      <UsersListWrapper>
        <ListTitle>Owner</ListTitle>
        <div>
          <ListItem>
            <ListItemAvatar>
              <Link to={`/profile/user`}>
              {/* <Link to={`/profile/user?id=${user.id}`}> */}
                {/* <AvatarStyled src={getAvatarUrl(user.id)} /> */}
                <AvatarStyled src=""/>
              </Link>
            </ListItemAvatar>
            {/* <ListItemText primary={<UserNameLink to={`/profile/user?id=${user.id}`}>{user.full_name || user.name}</UserNameLink>} /> */}
            <ListItemText primary={<UserNameLink to={`/profile/user`}>User Name</UserNameLink>} />
          </ListItem>
        </div>
      </UsersListWrapper>
      <UsersListWrapper>
        <ListTitle>Members</ListTitle>
        <div>
          <ListItem>
            <ListItemAvatar>
              <Link to={`/profile/user`}>
                <AvatarStyled src=""/>
              </Link>
            </ListItemAvatar>
            <ListItemText primary={<UserNameLink to={`/profile/user`}>User Name</UserNameLink>} />
          </ListItem>
          <Divider variant="inset" />
        </div>
      </UsersListWrapper>
    </>
  )

}