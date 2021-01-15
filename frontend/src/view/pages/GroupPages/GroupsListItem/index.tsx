import React from 'react'
import { Link } from 'react-router-dom'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import { ButtonContained, /*ButtonOutlined*/ } from '@view/shared/styles'
import { ApiTypes } from 'src/types'
import {
  GroupsListItemWrapper,
  ItemCover,
  ItemContentWraper,
  ItemHeader,
  AvatarStyled,
  GroupName,
  GroupCounter,
  GroupPublicity,
  GroupDescription,
} from './styles'

interface Props extends ApiTypes.Groups.RecievedGroup {}

export const GroupsListItem: React.FC<Props> = React.memo((props) => {
  const { group } = props
  const { avatar_original, description, id, is_public, name } = group

  return (
    <GroupsListItemWrapper>
      <ItemCover style={{ backgroundImage: avatar_original }} />
      <ItemContentWraper>
        <ItemHeader>
          <Link to="/groups/group">
            <AvatarStyled>
              <img src={AvatarIcon} alt="icon" />
            </AvatarStyled>
          </Link>
          <ButtonContained className="extra-small">Join</ButtonContained>
          {/* <ButtonOutlined>Edit group </ButtonOutlined> */}
          {/* <ButtonOutlined color="#A1AEC8">Remove</ButtonOutlined> */}
        </ItemHeader>
        <GroupName to={`/groups/group?id=${id}`}>{name}</GroupName>
        <GroupCounter>123 participants</GroupCounter>
        <GroupPublicity>{is_public ? 'Public' : 'Private'}</GroupPublicity>
        <GroupDescription>{description}</GroupDescription>
      </ItemContentWraper>
    </GroupsListItemWrapper>
  )
})