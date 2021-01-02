import React from 'react'
import { RouteComponentProps } from 'react-router'
import DeckIcon from '@material-ui/icons/Deck'
import {
  PageTitle,
  MyGropusWrapper,
  GroupsList,
  ButtonsWrapper,
  ButtonStyled,
  GroupAvatar,
  GroupName,
  GroupPublicity,
  GroupsListItem,
} from './styles'

interface Props extends RouteComponentProps { }

export const GroupsPage: React.FC<Props> = (props) => {
  const { history } = props

  return (
    <>
      <PageTitle>My Gropus</PageTitle>
      <MyGropusWrapper>
        <GroupsList>
          <GroupsListItem>
            <GroupAvatar
              variant="rounded"
              alt="Remy Sharp"
              src="">
              <DeckIcon fontSize="large" />
            </GroupAvatar>
            <div>
              <GroupName>Super group name</GroupName>
              <GroupPublicity>Public</GroupPublicity>
            </div>
          </GroupsListItem>
          <GroupsListItem>
            <GroupAvatar
              variant="rounded"
              alt="Remy Sharp"
              src="">
              <DeckIcon fontSize="large" />
            </GroupAvatar>
            <div>
              <GroupName>Super group name</GroupName>
              <GroupPublicity>Private</GroupPublicity>
            </div>
          </GroupsListItem>
        </GroupsList>
        <ButtonsWrapper>
          <ButtonStyled
            variant="contained"
            color="primary"
          >Public group list</ButtonStyled>
          <ButtonStyled
            variant="contained"
            color="primary"
            onClick={() => history.push('/groups/create')}
          >Create a group</ButtonStyled>
        </ButtonsWrapper>
      </MyGropusWrapper>
    </>
  )

} 