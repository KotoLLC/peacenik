import React from 'react'
import {
  GroupsListItemWrapper,
  ItemCover,
  ItemContentWraper,
  ItemHeader,
  ButtonContained,
  AvatarStyled,
  GroupName,
  GroupCounter,
  GroupPublicity,
  GroupDescription,
  ButtonOutlined,
} from './styles'

export const GroupsListItem = React.memo(() => {
  return (
    <GroupsListItemWrapper>
      <ItemCover style={{ backgroundImage: '' }} />
      <ItemContentWraper>
        <ItemHeader>
          <AvatarStyled />
          <ButtonContained>Join</ButtonContained>
          {/* <ButtonOutlined>Edit group </ButtonOutlined> */}
          {/* <ButtonOutlined color="#A1AEC8">Remove</ButtonOutlined> */}
        </ItemHeader>
        <GroupName>Photo lovers</GroupName>
        <GroupCounter>123 participants</GroupCounter>
        <GroupPublicity>Private</GroupPublicity>
        <GroupDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim dolorem, reiciendis vitae, saepe placeat molestias quo voluptates labore tempore deserunt consequatur quas rerum sint nisi? Porro sed quis atque reprehenderit!
        </GroupDescription>
      </ItemContentWraper>
    </GroupsListItemWrapper>
  )
})