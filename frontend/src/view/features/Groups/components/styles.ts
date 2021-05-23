import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import { ButtonOutlined } from '@view/shared/styles'
import DialogContent from '@material-ui/core/DialogContent'

export const GroupsContainer = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  max-width: 1170px;
  width: 100%;
  margin: 65px auto 0;
  padding: 30px 15px 30px;

  @media (max-width: 770px) {
    flex-wrap: wrap;
    margin-top: 50px;
    padding: 10px 15px 15px;
  }
`

export const PaperStyled = styled(Paper)`
  padding: 15px;
  position: relative;
`

export const PageTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 15px;
`

export const GroupsListWrapper = styled.div`
  width: calc(100% - 262px);
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 770px) {
    width: 100%;
  }
`

export const EmptyGroups = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: calc(100% - 30px);
  height: calc(100vh - 200px);
  margin-left: 30px;
  background: #E8EDF3;
  padding: 30px;

  @media (max-width: 960px){
    width: calc(100% - 15px);
    margin-left: 15px;
  }

  @media (max-width: 770px) {
    height: 450px;
    width: 100%;
    margin-left: 0px;
    margin-bottom: 10px;
  }
`

export const EmptyGroupsText = styled.p`
  display: inline-block;
  font-size: 18px;
  max-width: 460px;

  @media (max-width: 960px){
    font-size: 16px;
  }
`

export const EmptyGroupsTextWrapper = styled.div`
  text-align: center;
  width: 100%;
  /* font-family: 'SFUITextLight'; */
`

export const EmptyGroupsTextLink = styled(Link)`
  color: #599C0B;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export const EmptyGroupsIconWrapper = styled.figure`
  width: 196px;
  height: 196px;
  background: #FFFFFF;
  box-shadow: 0px 1px 4px 2px rgba(216, 216, 216, 0.2);
  border-radius: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 38px;

  .groug-icon {
    fill: #C8CFD4;
  }

  .icon {
    width: 108px;
    height: 108px;
  }

  @media (max-width: 960px){
   width: 157px;
   height: 157px;
   border-radius: 26px; 

   .icon {
      width: 87px;
      height: 87px;
    }
  }
`

export const CreateGroupContainer = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  flex-wrap: wrap;
  width: calc(100% - 30px);
  max-width: 750px;
  margin: 95px auto 30px;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px #D4D4D4;

  @media (max-width: 770px) {
    margin: 60px auto 30px
  }
`

export const EmptyScrenWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  background: #E8EDF3;
  width: calc(100% - 30px);
  min-height: 570px;
  max-width: 750px;
  margin: 95px auto 30px;
  padding: 30px;
`

export const AvatarsNote = styled.div`
  color: #A1AEC8;
  font-size: 12px;
  padding-bottom: 26px;
  margin-left: 15px;

  @media (max-width: 770px){
    padding-bottom: 15px;
  }
`

export const ViewMoreButton = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  cursor: pointer;
  color: #88909D;
  font-size: 12px;
  font-family: 'SFUITextMedium';
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: #EDF1F2;
  transition: 0.2s;
  border-radius: 0 0 4px 4px;

  &:hover {
    background: #dee2e3;
  }
`

export const GroupDescriptopn = styled.div`
  padding-top: 30px;
  position: relative;

  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    height: 1px;
    width: 50%;
    background: linear-gradient(90deg, rgba(247, 248, 249, 0.0001) 0%, #BEC4CC 59.24%);
    transform: rotate(-180deg);
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    height: 1px;
    width: 50%;
    background: linear-gradient(90deg, rgba(247, 248, 249, 0.0001) 0%, #BEC4CC 59.24%);
    transform: matrix(1, 0, 0, -1, 0, 0);
  }

  @media (max-width: 1025px){
    padding-top: 15px;
    padding-bottom: 25px;
    text-align: left;
    padding-left: 180px;
  }

  @media (max-width: 770px){
    text-align: center;
    padding: 15px 0 25px;
  }
`

export const DangerZoneWrapper = styled.div`
  margin-top: 50px;
  padding: 20px 16px;
  background: #fff;
  text-align: left;

  &.mobile-only{
    display: none;
   }
  
  @media (max-width: 1025px){
    &.desktop-only {
      display: none;
    }  

    &.mobile-only{
      display: block;
      width: 100%;
      margin: 15px 0 0;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`

export const DangerZoneTitle = styled.h3`
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;

  @media (max-width: 1025px){
    margin: 0;
  }
`

export const MemberMessageSidebar = styled.div`
  font-size: 12px;
  color: #A1AEC8;
  width: 100%;
`

export const MemberButtonOutlined = styled(ButtonOutlined)`
  margin-left: auto;
  margin-right: 0;

  @media (max-width: 770px){
    margin-left: 0;
    margin-top: 15px;
  }
`

export const DialogContentStyled = styled(DialogContent)`
  && {
    min-width: 555px;
    display: block;
    text-align: center;

    @media (max-width: 600px) {
      width: 90%;
    }    
  }
`

export const WarningText = styled.p`
  min-height: 20px;

  @media (max-width: 770px) {
    width: 100%;
    margin-top: 10px;
  }
`

export const GroupsListItemWrapper = styled.div`
  width: 262px;
  background: #fff;
  position: relative;
  margin: 0 0 30px 30px;

  @media (max-width: 1180px){
    width: calc(50% - 30px);
    margin: 0 0 30px 30px;
  }

  @media (max-width: 960px){
    width: calc(100% - 15px);
    margin: 0 0 15px 15px;
  }

  @media (max-width: 770px) {
    width: 100%;
    margin: 0 0 10px;
  }
`

export const ItemCover = styled.div`
  height: 80px;
  background-color: #A1AEC8; 
  background-image:  ${props => `url(${props.resource})`};
  background-position: center;
  background-size: cover;
`

export const ItemContentWraper = styled.div`
  padding: 10px 16px 16px;
`

export const ItemHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  position: relative;
`

export const GroupItemAvatar = styled(Avatar)`
  background: #DEE5F2;

  && {
    width: 62px;
    height: 62px;
    border: 3px solid #FFFFFF;
    position: absolute;
    left: 0;
    top: -41px;
  }
`

// export const GroupName = styled.span`
//   display: inline-block;
//   color: #262626;
//   font-family: 'SFUITextSemibold';
//   margin: 5px 0;
//   text-decoration: none;
// `

export const GroupNameLink = styled.div`
  display: inline-block;
  color: #262626;
  font-family: 'SFUITextSemibold';
  margin: 5px 0;
  text-decoration: none;
`

export const GroupCounter = styled.div`
  color: #788692;
  font-size: 14px;
  font-family: 'SFUITextLight';
`

export const ItemsGroupPublicity = styled.span`
  display: block;
  color: #788692;
  font-size: 12px;
  font-family: 'SFUITextBold';
  margin: 10px 0 0px;
`

export const GroupDescription = styled.p`
  color: #788692;
  font-size: 14px;
  font-family: 'SFUITextLight';
  height: 60px;
  margin: 10px 0 0;
  overflow: hidden;
`

export const NoButton = styled.div`
  height: 32px;
  width: 100%;
`