import styled, { css } from 'styled-components'
import Paper from '@material-ui/core/Paper'
import { NavLink, Link } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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

export const SidebarWrapper = styled.ul`
  padding: 0;
  margin: 0;
  width: 262px;
  background: #fff;  
  position: sticky;
  left: 0;
  top: 94px;
  box-shadow: 0px 1px 3px #D4D4D4;

  @media (max-width: 770px) {
    width: 100%;
    position: static;
    margin-bottom: 15px;
  }
`

export const SidebarItem = styled(NavLink)`
  height: 55px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(190, 196, 204, 0.5);
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  font-family: 'SFUITextBold';
  color: #88909D;
  transition: 0.15s;

  &.active {
    color: #262626;

    &:before {
      display: inline-block;
      width: 4px;
      height: 44px;
      border-radius: 10px;
      background: #599C0B;
      position: absolute;
      left: 0;
      top: 5px;
      content: '';
    }
  }

  &:hover {
    color: #262626;
    
  }
`

export const SidebarButtonWrapper = styled.li`
  list-style: none;
  padding: 20px;
`

const sidebarButtonStyles = css`
  display: inline-block;
  height: 30px;
  line-height: 30px;
  width: 100%;
  background: #599C0B;
  border-radius: 15px;
  font-size: 13px;
  text-align: center;
  text-decoration: none;
  font-family: 'SFUITextMedium';
  color: #fff;
  transition: 0.15s;
  cursor: pointer;

  &:hover {
    background: #4e8c07;
  }
`

export const SidebarButtonLink = styled(Link)`
  ${sidebarButtonStyles}
`

export const SidebarButton = styled.span`
  ${sidebarButtonStyles}
  background: #A1AEC8;
  cursor: default;

  &:hover {
    background: #A1AEC8;
  }

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

export const UploadInput = styled.input`
  display: none;
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

export const CoverWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 200px;
  width: 100%;
  background-color: #A1AEC8;
  background-image:  ${props => `url(${props.resource})`};
  background-position: center;
  background-size: cover;

  @media (max-width: 770px){
    height: 100px;
    
    label {
      margin-left: 30px;
    }
  }
`

export const CoverIconWrapper = styled.figure`
  border: 2px solid #FFFFFF;
  width: 72px;
  height: 72px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media (max-width: 770px){
    width: 36px;
    height: 36px;
    border: 1px solid #FFFFFF;

    img {
      width: 16px;
    }
  }
`

export const AddCoverButtonWrapper = styled.div`
  text-align: center;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 770px){
    margin-top: 5px;
  }
`

export const AddCoverButton = styled.span`
  display: inline-block;
  font-family: 'SFUITextMedium';
  color: #fff;
  font-size: 16px;
  padding-bottom: 2px;
  line-height: 16px;
  position: relative;
  cursor: pointer;

  &:after {
    display: inline-block;
    content: '';
    width: 100%;
    height: 1px;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    transition: 0.15s;
    opacity: 1;
  }

  &:hover {
    &:after {
      opacity: 0;
    }
  }

  @media (max-width: 770px){
    font-size: 12px;
  }
`

export const CreateGroupAvatar = styled(Avatar)`
  background: #DEE5F2;
  border: 4px solid #FFFFFF;
  width: 140px;
  height: 140px;
  cursor: pointer;
  margin-left: 23px;

  @media (max-width: 770px){
    width: 90px;
    height: 90px;
    border: 2px solid #FFFFFF;
    margin-left: 15px;

    .avatar-icon {
      width: 24px;
    }
  }
`

export const AvatarsBlock = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: -72px;
  width: 100%;

  @media (max-width: 770px) {
    margin-top: -45px;
  }
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

export const FormWrapper = styled.form`
  padding: 30px 97px 30px 60px;
  width: 100%; 

  @media (max-width: 770px) {
    padding: 15px 15px 20px;
  }
`

export const FieldWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  &.radios {
    align-items: flex-start;
  }

  @media (max-width: 770px) {
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
`

export const FieldPlaceholder = styled.span`
  color: #A1AEC8;
  padding-right: 20px;
  text-align: right;
  width: 130px;

  &.radios {
    /* padding-right: 9px; */
  }

  @media (max-width: 770px) {
    text-align: left;
    padding-right: 0;
    margin-bottom: 10px;
    font-size: 14px;
  }
`

export const InputField = styled.input`
  border: 1px solid #C8CFD4;
  border-radius: 4px;
  height: 30px;
  width: 460px;
  padding: 0 10px;
  outline: none;
  transition: 0.15s;
  color: #262626;
  font-size: 14px;
  font-family: 'SFUITextMedium';

  &:focus {
    border-color: #A1AEC8;
  }

  @media (max-width: 770px) {
    width: 100%;
  }
`

export const TextareaField = styled.textarea`
  border: 1px solid #C8CFD4;
  border-radius: 4px;
  height: 80px;
  width: 460px;
  padding: 4px 10px;
  outline: none;
  transition: 0.15s;
  color: #262626;
  font-size: 14px;
  font-family: 'SFUITextMedium';
  resize: none;

  &:focus {
    border-color: #A1AEC8;
  }

  @media (max-width: 770px) {
    width: 100%;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const RadioStyled = styled(Radio)`
  && {
    color: #599C0B;
    padding: 0 9px 0 0;

    &:checked {
      color: #599C0B;     
    }
  }
`

export const FormControlLabelStyled = styled(FormControlLabel)`
  
  && {
    margin-right: 30px;
    align-items: flex-start;
  }

  .title {
    width: 100px;
    font-size: 14px;
    font-family: 'SFUITextSemibold';
    position: relative;
  }

  .title-note {
    display: block;
    left: 0;
    bottom: -14px;
    font-size: 10px;
    color: #A1AEC8;
  }
  
`

export const RadiosWrapper = styled.div`
  display: flex;
  margin-bottom: 2px;
  margin-left: 9px;
`

export const GroupCover = styled.div`
  width: 100%;
  height: 333px;
  margin-top: 60px;
  background-position: center;
  background-size: cover;
  background-color: #A1AEC8;
  background-image:  ${props => `url(${props.resource})`};

  @media (max-width: 1025px){
    height: 250px;
  }

  @media (max-width: 770px){
    margin-top: 45px;
    height: 108px;
  }
` 

export const GroupHeader = styled.header`
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px #D4D4D4;

  &.mobile-only{
    display: none;
  }

  @media (max-width: 1025px){
    &.desktop-only {
      display: none;
    }  

    &.mobile-only{
      display: block;
      box-shadow: none;
    }
  }

  @media (max-width: 770px){
    padding-bottom: 15px;
  }
`

export const HeaderContainer = styled.div`
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 770px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`

export const CountersWrapper = styled.div`
  margin-left: 290px;
  display: flex;
  align-items: center;

  @media (max-width: 1025px) {
    margin-left: 176px;
  }  
  
  @media (max-width: 770px) {
    width: 100%;
    margin: 0 0 15px;
    justify-content: center;
  }  
`

export const HeaderCounterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  justify-content: center;
  text-align: center;

  &:first-child {
    margin-right: 45px;
    position: relative;

    &:after {
      display: inline-block;
      position: absolute;
      right: -29px;
      top: calc(50% - 4px);
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ABB7CD;
    }
  }
`

export const HeaderCounter = styled.span`
  width: 100%;
  color: #A1AEC8;
  font-size: 20px;
  font-family: 'SFUITextBold';

  @media (max-width: 770px){
    font-size: 16px;
  }
`

export const HeaderCounterName = styled.span`
  width: 100%;
  font-size: 12px;
  text-transform: uppercase;
  font-family: 'SFUITextMedium';
  margin-bottom: 2px;
`

export const LeftSideBar = styled.aside`
  width: 260px;
  margin-right: 30px;
  text-align: center;

  @media (max-width: 1025px){
    width: calc(100vw + 30px);
    margin: 0 0 20px;
    background: #fff;
    position: relative;

    &:before,
    &:after {
      content: '';
      width: 15px;
      height: 100%;
      background: #fff;
      display: block;
      position: absolute;
      top: 0;
    }

    &:before {
      left: -15px;
    }
    
    &:after {
      right: -15px;
    }
  }
`

export const RightSideBar = styled.aside`
  position: relative;
  padding: 20px 0 20px;
  width: 260px;
  margin-left: 30px;
  background: #fff;
  border-radius: 0 0 4px 4px;

  @media (max-width: 960px){
    margin-left: 15px;
  }

  @media (max-width: 770px){
    width: 100%;
    margin-left: 0;
    padding: 15px 0;
  }
`

export const CentralBar = styled.section`
  background: #fff;
  flex-grow: 1;
  padding: 20px 0 20px;
  position: relative;
  border-radius: 0 0 4px 4px;

  @media (max-width: 770px){
    width: 100%;
    margin-bottom: 20px;
    padding: 15px 0;
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

export const BarTitle = styled.div`
  padding: 0 20px 5px;
  color: #000;

  @media (max-width: 770px){
    padding: 0 15px;
  }
`

export const GroupMainWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 30px;
  padding-bottom: 30px;

  @media (max-width: 1025px){
    padding-top: 0px;
  }
`

export const GroupLayoutAvatar = styled(Avatar)`
  width: 200px;
  height: 200px;
  background: #DEE5F2;
  margin: -160px auto 30px;
  border: 6px solid #FFFFFF;

  @media (max-width: 1025px){
    width: 160px;
    height: 160px;
    margin: -80px 0 0;
  }
  
  @media (max-width: 770px){
    width: 120px;
    height: 120px;
    margin: -60px 0 0;
    border: 3px solid #FFFFFF;
  }
`

export const LaypoutsGroupName = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  font-family: 'SFUITextMedium';

  @media (max-width: 1025px){
    margin-top: -60px;
    padding-left: 180px;
    font-size: 20px;
    text-align: left;
  }
  
  @media (max-width: 770px){
    margin-top: -50px;
    padding-left: 135px;
    font-size: 18px;
  }
`

export const LaypoutsGroupPublicity = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  color:  #788692;

  @media (max-width: 1025px){
    padding-left: 180px;
    font-size: 16px;
    text-align: left;
  }

  @media (max-width: 770px){
    font-size: 14px;
    padding-left: 135px;
    margin-top: -10px;
    margin-bottom: 20px;
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

export const MemberHeaderSidebar = styled.div`
  display: flex;
  /* align-items: center; */
`

export const MemberWrapper = styled.li`
  list-style: none;
  min-height: 87px;
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid rgba(200, 207, 212, 0.6);
  display: flex;
  align-items: center;

  &:last-child {
    border: none;
  }

  &.sidebar {
    display: block;
    padding: 15px;
  }

  @media (max-width: 770px){
    padding: 15px 15px 20px;
    flex-wrap: wrap;

    &.sidebar {
      padding: 15px 15px 20px;
    }
  }
`

export const MemberAvatar = styled(Avatar)`
  width: 56px;
  height: 56px;
  background: #DEE5F2;
  margin-right: 16px;

  &.sidebar {
    height: 40px;
    width: 40px;
  }

  @media (max-width: 770px){
    width: 50px;
    height: 50px;
    margin-right: 12px;

    &.sidebar {
      width: 50px;
      height: 50px;
      margin-right: 12px;
    }
  }
`

export const MemberName = styled(Link)`
  display: block;
  text-decoration: none;
  font-family: 'SFUITextMedium';
  color: #000;

  &.sidebar {
    font-size: 14px;
    width: 100%;
    margin-bottom: 5px;
    display: block;
  }

  @media (max-width: 770px){
    width: calc(100% - 65px);
  }
`

export const MemberNameWrapperSidebar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

export const MemberMessageSidebar = styled.div`
  font-size: 12px;
  color: #A1AEC8;
  width: 100%;
`

export const MemberButtonsWrapperSidebar = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 770px){
    justify-content: start;
  }
`

export const MemberButtonOutlined = styled(ButtonOutlined)`
  margin-left: auto;
  margin-right: 0;

  @media (max-width: 770px){
    margin-left: 0;
    margin-top: 15px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    min-width: 110px;
  }
`

export const TopBarButtonWrapper = styled.div`
  margin-left: 290px;

  @media (max-width: 1025px){
    margin-left: 180px;
  }
  
  @media (max-width: 770px){
    margin-left: 0px;
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

export const GroupNameLink = styled(Link)`
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