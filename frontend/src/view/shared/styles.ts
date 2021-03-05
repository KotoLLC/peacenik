import styled, { css } from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { Link, NavLink } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import CircularProgress from '@material-ui/core/CircularProgress'
import Avatar from '@material-ui/core/Avatar'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'

export const Container = styled.main`
  width: 100%;
  max-width: 1170px;
  padding: 0 15px;
  margin: 0 auto;
`

export const TooltipStyle = styled(Tooltip)`
  && {
    margin-left: 0px;
  }
`

export const IconButtonStyled = styled(IconButton)`
  && {
    color: #fff;
  }
`

export const ListItemIconStyled = styled(ListItemIcon)`
  color: #262626;
  
  && {
    min-width: 40px;
  }
`

export const MenuButton = styled(Button)`
  && {
    color: #fff;
  }
`

export const PageWrapper = styled.main`
  padding: 0px;
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;

  @media (max-width: 770px) {
    /* padding: 0px 0px 120px; */
  }
`

export const PageContent = styled.section`
  width: 100%;
`

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 90px;
  margin-top: 50px;
  width: 100%;
  padding-bottom: 20px;

  @media (max-width: 600px) {
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 15px;

    align-items: center;
  }
`

export const TabsWrapper = styled.div`
  display: inline-flex;
`

export const TabStyled = styled(Tab)`
  && {
    text-transform: none;
  }
`

export const TabsStyled = styled(Tabs)``

export const NotFoundWrapper = styled.div`
  padding: 100px 20px;
  text-align: center;
`

export const DialogTextWrapper = styled.div`
  display: flex;
  margin-bottom: 5px;
`

export const DialogTextLeft = styled.div`
  width: 25%;
  font-weight: bold;
`

export const DialogTextRight = styled.div`
  width: 75%;
`

export const DialogTitleStyled = styled(DialogTitle)`
  text-align: center;
`

export const DialogStyled = styled(DialogTitle)`
  text-align: center;
`

export const DialogContentStyled = styled(DialogContent)`
  && {
    min-width: 500px;

    @media (max-width: 600px) {
      min-width: auto;
    }    
  }
`

export const PreloaderViewport = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2000;
  width: 100%;
  height: 100vh;
  background: #fff;
`

export const AvatarWrapperLink = styled(Link)`
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  width: 40px;
  height: 40px;
  margin: 0 10px;

  @media (max-width: 700px){
    width: 28px;
    height: 28px;
    margin: 0;
  }
`

export const AvatarWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  cursor: pointer;

  @media (max-width: 700px){
    transform: scale(0.7);
    margin: 0;
  }
`

export const ErrorMessage = styled.div`
  font-size: 14px;
  color: red;
  margin: 20px 0 10px;
`

export const MenuItemWrapper = styled.div`
  display: flex;
  position: relative;
  box-sizing: border-box;
  text-align: left;
  align-items: center;
  justify-content: flex-start;
`

export const ForwardIconWrapper = styled.span`
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 2px;
  top: 65px;
  top: calc(50vh - 20px);
  width: 0;
  height: 0;
  overflow: hidden;
  border-radius: 50%;
  background: rgba(0,0,0,.2);
  opacity: 0;
  transition: opacity 0.3s;

  &.visible {
    width: 40px;
    height: 40px;
    opacity: 0.7;
  }
`

export const BackIconWrapper = styled.span`
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 2px;
  top: 65px;
  top: calc(50vh - 20px);
  width: 0;
  height: 0;
  overflow: hidden;
  border-radius: 50%;
  background: rgba(0,0,0,.2);
  opacity: 0;
  transition: opacity 0.3s;

  &.visible {
    width: 40px;
    height: 40px;
    opacity: 0.7;
  }
`

export const MentionLink = styled(Link)`
  font-weight: bold;
  color: #000;
  transition: 0.2s;

  &.mention {
    color: #000;
  }

  &:hover {
    text-decoration: underline;
  }
`

export const ConnectionErrorWrapper = styled.div`
  width: 80%;
  height: calc(80vh - 56px);
  max-width: 770px;
  background: #fff;
  position: fixed;
  padding: 15px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
  z-index: 100;
  left: 50%;
  top: calc(50% + 28px);
  transform: translate(-50%, -50%);
  border-radius: 8px;
  box-shadow:  0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
`

export const RefreshButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  width: 100%;
`

export const ConnectionErorrTitle = styled.h3`
  width: 100%;
`

export const MenuItemStyled = styled(MenuItem)`
  min-width: 180px;

  &.logout {
    color: #A1AEC8;
    position: relative;

    svg {
      color: #A1AEC8;
    }

    &:before {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      width: 160px;
      height: 1px;
      background: #979797;
      opacity: 0.6;
      content: '';
    }
  }
`
export const MenuStyled = styled(Menu)`
  top: 40px !important;
  border-radius: 6px;
`

export const ButtonContained = styled(Button)`
  min-width: 120px;
  height: 32px;
  line-height: 32px;
  background: #599C0B;
  border-radius: 16px;
  padding: 0 20px;
  font-family: 'SFUITextMedium';
  text-align: center;
  color: #fff;
  font-size: 14px;
  transition: 0.15s;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  text-transform: none;

  &.large {
    min-width: 160px;
  }
  
  &.small {
    height: 30px;
    line-height: 30px;
    min-width: 110px;
    font-size: 12px;
  }

  &.extra-small {
    height: 26px;
    line-height: 26px;
    min-width: 105px;
    font-size: 12px;
    border-radius: 13px;
  }

  &:hover {
    background: #4e8c07;
  }

  &.grey {
    background: #A1AEC8;

    &:hover {
      background: #262626;
    }
  }

  &.desktop-only {
    @media (max-width: 770px){
      display: none;
    }
  }

  &.mobile-only {
    display: none;

    @media (max-width: 770px) {
      display: flex;
      margin-left: 15px;
      margin-right: 15px;
    }
  }

  &:disabled {
    background: #A1AEC8;
    color: #fff;
  }

  @media (max-width: 770px){
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    min-width: 110px;
  }
`

export const ButtonOutlined = styled(Button)`
  margin-right: 10px;
  min-width: 120px;
  height: 32px;
  line-height: 32px;
  outline: none;
  background: #fff;
  border-radius: 16px;
  font-family: 'SFUITextMedium';
  text-align: center;
  border: 1px solid #599C0B;
  color: #599C0B;
  font-size: 14px;
  transition: 0.15s;
  text-decoration: none;
  cursor: pointer;
  text-transform: none;

  &:hover {
    background: #fff;
  }

  &.large {
    min-width: 160px;
  }

  &.small {
    height: 30px;
    line-height: 30px;
    min-width: 110px;
    font-size: 12px;
  }
  
  &.extra-small {
    height: 26px;
    line-height: 26px;
    min-width: 105px;
    font-size: 12px;
    border-radius: 13px;
  }

  &.grey {
    border-color: #A1AEC8;
    color: #A1AEC8;

    &:hover {
      border-color: #262626;
      color: #262626;
    }
  }

  &:disabled {
    background: #fff;
    border-color: #A1AEC8;
    color: #A1AEC8;
  }

  @media (max-width: 770px){
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    min-width: 110px;
  }
`

export const CircularProgressWhite = styled(CircularProgress)`
  color: #fff;
`

export const UserName = styled.span``

export const UserNameLink = styled(Link)`
  cursor: pointer;
  color: #000;

  &:hover {
    text-decoration: none;
  }
`

export const AvatarStyled = styled(Avatar)`
  && {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    background: #DEE5F2;
    cursor: pointer;

    @media (max-width: 770px) {
      width: 50px;
      height: 50px;
      margin-right: 12px;
    }

    &.no-link {
      cursor: default;
    }
  }
`

export const ListStyled = styled.div`
  position: relative;
  overflow: auto;
  height: calc(100vh - 40px);
`

export const ContainerTitle = styled.h3`
  font-size: 14px;
  padding: 5px 10px;
  margin: 0;
  text-transform: uppercase;
`

export const PageCoverWrapper = styled.div`
  background-color: #A1AEC8;
  position: relative;
`

export const PageCoverIconWrapper = styled.figure`
  position: absolute;
  display: inline-flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px;
  border: 2px solid #fff;
  border-radius: 50%;

  svg {
    font-size: 40px;
    color: #fff;
  }

  @media (max-width: 770px){
    display: none;
  }
`

export const PageCover = styled.div`
  width: 100%;
  height: 333px;
  margin-top: 60px;
  position: relative;
  z-index: 10;
  background-position: center;
  background-size: cover;
  background-image:  ${props => `url(${props.resource})`};

  @media (max-width: 1025px){
    height: 250px;
  }

  @media (max-width: 770px){
    margin-top: 45px;
    height: 108px;
  }
` 

export const ProfileAvatar = styled(Avatar)`
  width: 200px;
  height: 200px;
  background: #DEE5F2;
  margin: -160px auto 30px;
  border: 6px solid #FFFFFF;
  position: relative;
  z-index: 20;

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
  max-width: calc(100% - 580px);
  padding: 20px 0 20px;
  position: relative;
  border-radius: 0 0 4px 4px;

  @media (max-width: 1024px){
    max-width: calc(100% - 290px);
  }

  @media (max-width: 770px){
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
    padding: 15px 0;
  }
`

export const PageColumnBarsWrapper = styled.div`
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

export const PageBarTitle = styled.div`
  padding: 0 20px 5px;
  color: #000;

  @media (max-width: 770px){
    padding: 0 15px;
  }
`

export const ProfileName = styled.h2`
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

export const ProfileNote = styled.p`
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

export const CoverBarWrapper = styled.header`
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

export const CoverBarContainer = styled.div`
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

export const CoverBarCounterWrapper = styled.div`
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

export const CoverBarCounter = styled.span`
  width: 100%;
  color: #A1AEC8;
  font-size: 20px;
  font-family: 'SFUITextBold';

  @media (max-width: 770px){
    font-size: 16px;
  }
`

export const CoverBarCounterName = styled.span`
  width: 100%;
  font-size: 12px;
  text-transform: uppercase;
  font-family: 'SFUITextMedium';
  margin-bottom: 2px;
`

export const CoverBarCounters = styled.div`
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

export const CoverBarButtonsWrapper = styled.div`
  margin-left: 290px;

  &.profile {
    margin-left: 0;
  }

  @media (max-width: 1025px){
    margin-left: 180px;
  }
  
  @media (max-width: 770px){
    margin-left: 0px;
  }
`

export const UsersListItemWrapper = styled.li`
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

export const UsersListItemAvatar = styled(Avatar)`
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

export const UsersListItemNamesWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;
  
  @media (max-width: 770px){
    width: calc(100% - 65px);
  }
`

export const UsersListItemFullName = styled(Link)`
  display: block;
  text-decoration: none;
  font-family: 'SFUITextMedium';
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;

  &.sidebar {
    font-size: 14px;
    margin-bottom: 5px;
    display: block;
  }

  @media (max-width: 770px){
    width: calc(100% - 65px);
  }
`

export const UsersListItemName = styled(Link)`
  font-size: 12px;
  color: #ABB7CD;
  font-family: 'SFUITextRegular';

  @media (max-width: 1025px){}
  
  @media (max-width: 770px){}
`

export const UsersListItemButtons = styled.div`
  margin-left: auto;

  @media (max-width: 770px){
    margin-left: 0;
    margin-top: 15px;
  }
`

export const UsersListHeaderSidebar = styled.div`
  display: flex;
  /* align-items: center; */
`

export const UsersListNameWrapperSidebar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;
`

export const UsersListButtonsWrapperSidebar = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 770px){
    justify-content: start;
  }
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

export const EditCoverWrapper = styled.div`
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

export const EditCoverLabel = styled.label`
  @media (max-width: 1025px){
    margin-left: 50px;
  }
`

export const EditCoverIconWrapper = styled.figure`
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

export const EditCoverAddButtonWrapper = styled.div`
  text-align: center;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 770px){
    margin-top: 5px;
  }
`

export const EditCoverAddButton = styled.span`
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

export const UploadInput = styled.input`
  display: none;
`

export const EditsAvatar = styled(Avatar)`
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

export const EditsAvatarWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: -72px;
  width: 100%;

  @media (max-width: 770px) {
    margin-top: -45px;
  }
`

export const EditFormWrapper = styled.form`
  padding: 30px 97px 30px 60px;
  width: 100%; 

  @media (max-width: 770px) {
    padding: 15px 15px 20px;
  }
`

export const EditFieldWrapper = styled.div`
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

export const EditFieldPlaceholder = styled.span`
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

export const EditInputField = styled.input`
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

export const EditTextareaField = styled.textarea`
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

export const EditButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const EditRadioStyled = styled(Radio)`
  && {
    color: #599C0B;
    padding: 0 9px 0 0;

    &:checked {
      color: #599C0B;     
    }
  }
`

export const EditControlLabelStyled = styled(FormControlLabel)`
  
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

export const EditRadiosWrapper = styled.div`
  display: flex;
  margin-bottom: 2px;
  margin-left: 9px;
`

export const CheckboxLabel = styled(FormControlLabel)`
	&& {
		margin: 0 0 0 -14px;

		span:nth-child(1) { 
			color: #A1AEC8;
			
			input:checked + svg {
				color: #599C0B;
			}
		}
		
		span:nth-child(2) {
			font-family: 'SFUITextRegular';
			font-size: 12px;
			color: #A1AEC8;
		}  
	}

  &.general {

    && {
      span:nth-child(2) {
			font-family: 'SFUITextMedium';
			font-size: 14px;
			color: #262626;
		  } 
    }
    
  }
`