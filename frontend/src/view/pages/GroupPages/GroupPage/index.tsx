import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { PageLayout } from '@view/shared/PageLayout'
import AvatarIcon from '@assets/images/groups-avatar-icon.svg'
import { DangerZone } from './DangerZone'
import { GroupMember } from './GroupMember'
import { GroupMemberPotential } from './GroupMemberPotential'
import { GroupTopBar } from './GroupTopBar'
import {
  GroupCover,
  GroupContainer,
  GroupMainWrapper,
  LeftSideBar,
  RightSideBar,
  CentralBar,
  AvatarStyled,
  GroupName,
  GroupPublicity,
  GroupDescriptopn,
  BarTitle,
  ViewMoreButton,
} from './styles'

interface Props extends RouteComponentProps { }

export const GroupPage: React.FC<Props> = (props) => {

  return (
    <PageLayout>
      <GroupCover />
      <GroupTopBar />
      <GroupContainer>
        <GroupMainWrapper>
          <LeftSideBar>
            <AvatarStyled>
              <img src={AvatarIcon} alt="icon" />
            </AvatarStyled>
            <GroupName>We are photo lovers!</GroupName>
            <GroupPublicity>Public group</GroupPublicity>
            <GroupDescriptopn>
              Beauty expert and renowned makeup artist Sonia Kashuk, who has worked with the world’sma powder brush dusted with sheer, loose powder.
          </GroupDescriptopn>
            <DangerZone />
          </LeftSideBar>
          <CentralBar>
            <BarTitle>Members (367)</BarTitle>
            <GroupMember />
            <GroupMember />
            <ViewMoreButton>View more</ViewMoreButton>
          </CentralBar>
          <RightSideBar>
            <BarTitle>Waiting for approval (14)</BarTitle>
            <GroupMemberPotential/>
            <GroupMemberPotential/>
            <ViewMoreButton>View more</ViewMoreButton>
          </RightSideBar>
        </GroupMainWrapper>
      </GroupContainer>
    </PageLayout>
  )
}