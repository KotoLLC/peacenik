import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import AddIcon from '@material-ui/icons/Add'
import FavoriteIcon from '@material-ui/icons/Favorite'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'
import StorageIcon from '@material-ui/icons/Storage'
import { Link } from 'react-router-dom'

export const NotificationWrapper = styled(Link)`
  padding: 16px 16px 16px 21px;
  background: #fff;
  border-bottom: 1px solid #dee2e5;
  display: flex;
  width: 100%;
  min-height: 92px;
  position: relative;
  transition: 0.2s;
  
  &:hover {
    background: rgba(89, 156, 11, 0.1);
  }

  /* &.read{
    background: #fff;
  } */
  
  @media (max-width: 375px) {
    max-height: 105px;
    min-height: 80px;
    height: 100%;
    padding: 12px 10px;
  }
`
export const AvatarBlock = styled.div`
  width: 60px;
  height: 60px;
  position: relative;
  display: inline-block;
`
export const AvatarStyled = styled(Avatar)`
  width: 60px;
  height: 60px;
  z-index: 1;

  @media (max-width: 770px){
    width: 50px;
    height: 50px;
  }
`
export const IconBackground = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #fff;
  position: absolute;
  bottom: -4px;
  right: -4px;
  z-index: 100;
  background: ${props => props.color ? props.color : '#ccc'};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 770px){
    bottom: 4px;
    right: 0;
  }
`

export const AddIconStyled = styled(AddIcon)`
  color: #fff;
  width: 18px;
`
export const LikeIconStyled = styled(FavoriteIcon)`
  color: #fff;
  width: 20px;
  height: 14px;
`

export const CommentIconStyled = styled.img`
  color: #fff;
  width: 12px;
`

export const StorageIconStyled = styled(StorageIcon)`
  color: #fff;
  width: 20px;
  height: 14px;
`

export const ImagePreviewBlock = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin-left: 16px;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 375px) {
    align-self: flex-end;
  }
`

export const NotifyBlock = styled.div`
  width: 100%;
  display: flex;
  margin-left: 16px;

  @media (max-width: 375px) {
    margin-left: 10px;
  }
`
export const NotifyText = styled.div`
  flex-grow: 1;
  @media (max-width: 770px) {
    max-width: calc(100% - 120px);
  }
`
export const NotifyName = styled.p`
  color: #000;
  font-size: 14px;
  font-family: "SFUITextBold";
  line-height: 24px;
  max-height: 50px;
  /* overflow: hidden; */
`
export const NotifyContent = styled.p`
  font-size: 12px;
  font-family: "SFUITextRegular";
  line-height: 18px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #262626;

  span {
    color: #a1aec8;
  }

  @media (max-width: 375px) {
    -webkit-line-clamp: 3;
  }
`

export const NotificationsListWrapper = styled.div`
  display: block;
  width: 554px;
  height: 660px;
  background-color: #fff;
  box-shadow: 2px 9px 20px rgba(74, 74, 74, 0.6);
  position: absolute;
  z-index: 1000;
  top: 60px;
  right: -83px;

  &:before {
    content: "";
    position: absolute;
    border: 14px solid transparent;
    border-bottom: 12px solid #fff;
    right: 81px;
    top: -26px;

    @media (max-width: 375px) {
      display: none;
    }
  }

  @media (max-width: 770px) {
    margin: 20px 15px;
    overflow-x: hidden;
    width: calc(100% - 30px);
    right: 0;
    top: 40px;
  }

  @media (max-width: 375px) {
    max-height: calc(100vh - 80px);
  }
`

export const NewNotifications = styled.div`
  width: 100%;
  height: 48px;
  color: #000;
  font-size: 14px;
  font-family: "SFUITextBold";
  line-height: 16px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  padding-left: 21px;
  background: rgba(89, 156, 11, 0.1);
  border-bottom: 2px solid rgba(171, 183, 205, 0.4);
`

export const NotificationsListHeader = styled.div`
  width: 100%;
  height: 65px;
  font-size: 17px;
  font-family: "SFUITextMedium";
  color: #262626;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgba(171, 183, 205, 0.4);

  @media (max-width: 375px) {
    display: none;
  }
`
export const NotificationsContent = styled.div`
  height: calc(100% - 65px);
  overflow: auto;

  @media (max-width: 375px) {
    height: 100%;
  }
`

export const NotificationsIconWrapper = styled.div`
  width: 196px;
  height: 196px;
  border-radius: 38px;
  margin: 0 auto;
  margin-top: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 10px 2px rgba(216, 216, 216, 0.3);

  @media (max-width: 375px) {
    width: 158px;
    height: 158px;
    border-radius: 26px;
    margin-top: 60px;
  }
`
export const NotificationsIconStyled = styled(NotificationsIcon)`
  color: #c9cfd4;
  width: 110px;
  height: 110px;
  opacity: 0.5;

  @media (max-width: 375px) {
    width: 88px;
    height: 88px;
  }
`
export const NotificationsText = styled.p`
  text-align: center;
  color: #262626;
  font-size: 18px;
  font-family: "SFUITextRegular";
  line-height: 27px;
  margin-top: 38px;

  @media (max-width: 375px) {
    font-size: 16px;
  }
`

export const BadgeStyled = styled(Badge)`
  cursor: pointer;

  .MuiBadge-badge {
    background-color: #F22229;
    border: 1px solid #fff;
  }
`

export const MenuIconWrapper = styled.div`
  display: inline-block;
  transition: 0.15s;
  position: relative;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #C9CFD4;

  .MuiSvgIcon-root {
    position: relative;
    z-index: 1100;
  }

  .MuiBadge-badge {
    z-index: 1200;
  }

  &:after {
    display: inline-block;
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 24px;
    height: 4px;
    border-radius: 100px;
    background: transparent;
    transition: 0.15s;
    content: '';
  }

  &.active {
    color: #262626;

    &:after {
      background: #599C0B;
    }
  }

  &:hover {
    color: #262626;

    &:after {
      background: #599C0B;
    }
  } 

  @media (max-width: 770px) {
    position: static;

    &:after {
      display: none;
    }
  }
`

export const ClearButtonWrapper = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`