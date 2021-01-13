import React from 'react'
import { Link } from 'react-router-dom'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import { ButtonContained, /*ButtonOutlined*/ } from '@view/shared/styles'
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

export const GroupsListItem = React.memo(() => {
  return (
    <GroupsListItemWrapper>
      <ItemCover style={{ backgroundImage: '' }} />
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
        <GroupName to="/groups/group">Photo lovers</GroupName>
        <GroupCounter>123 participants</GroupCounter>
        <GroupPublicity>Private</GroupPublicity>
        <GroupDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim dolorem, reiciendis vitae, saepe placeat molestias quo voluptates labore tempore deserunt consequatur quas rerum sint nisi? Porro sed quis atque reprehenderit!
        </GroupDescription>
      </ItemContentWraper>
    </GroupsListItemWrapper>
  )
})