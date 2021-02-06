import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import { Link } from 'react-router-dom'
import { ButtonOutlined } from '@view/shared/styles'
import DialogContent from '@material-ui/core/DialogContent'

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
    margin: 0;
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

  @media (max-width: 1025px){
    padding-top: 0px;
  }
`

export const AvatarStyled = styled(Avatar)`
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

export const GroupName = styled.h2`
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

export const GroupPublicity = styled.p`
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
      margin: 15px 0 30px;
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