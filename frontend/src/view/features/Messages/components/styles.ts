import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Avatar from '@material-ui/core/Avatar'

export const MessagesWrapper = styled.div`
  position: relative;
  width: 1140px;
  min-height: calc(100vh - 150px);
  background: #FFFFFF;
  margin: 0 auto 31px auto;
  display: flex;

  @media (max-width: 770px) {
    width: calc(100% - 30px);
    padding: 15px 0 0 0;
    min-height: calc(100vh - 100px);
  }
`
export const SideBarWrapper = styled.div`
  width: 460px;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding: 0;
  `
export const ContentWrapper = styled.div`
  flex: 1 0 auto;
  background: #e8edf3;
`

export const SendOutlineIconWrapper = styled.div`
  width: 200px;
  height: 200px;
  padding: 45px;
  background: #fff;
  border-radius: 35px;
  margin-bottom: 70px;
  svg {
    fill: #e9ecee;
  }
`;
export const SendOutlineWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
export const AvatarWrapperLink = styled(Link)`
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  width: 50px;
  height: 50px;
  flex-shrink: 0;

  &.small {
    width: 40px;
    height: 40px;

    .MuiAvatar-fallback,
    .MuiAvatar-root {
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: 770px) {
    width: 36px;
    height: 36px;

    &.small {
      width: 30px;
      height: 30px;
    }
  }

  /* .MuiAvatar-root {
    width: 50px !important;
    height: 50px !important;
  } */
`

export const AvatarStyled = styled(Avatar)`
  && {
    /* margin-right: 16px; */
    background: #bdbdbd;
    width: 50px;
    height: 50px;

    @media (max-width: 770px) {
      width: 36px;
      height: 36px;
    }
  }
`
export const UserNameLink = styled(Link)`
  font-family: 'SFUITextMedium';
  font-size: 18px;
  margin-left: 16px;
  color: #000;

  @media (max-width: 770px){
    font-size: 16px;
    margin-left: 10px;
  }

  @media (max-width: 600px) {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 130px;
  }
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  max-width: 250px;
  min-width: 250px;
  width: 250px;
`;

export const SidebarWrapper = styled.div``;
export const SidebarHeader = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 1px 1px 3px 1px #d4d4d4;
`;
export const SidebarContent = styled.div`
  
`;

export const ListTabs = styled(Tabs)`
  display: flex;
  width: 100%;

  .MuiTabs-indicator {
    background: #599C0B;
  }

  @media (max-width: 770px) {
    width: 100%;
  }
`

export const ListTab = styled(Tab)`
  && {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    font-family: 'SFUITextMedium';
    opacity: 0.5;
    transition: all 0.2s;
    color: #88909D;
  }

  
  &.Mui-selected {
    font-weight: 600;
    color: #599C0B;
    font-family: 'SFUITextBold';
    opacity: 1;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    background: #C8CFD4;
    width: 100%;
    height: 2px;
  }
`
export const ListTabsWrapper = styled.div`
  display: flex;
  align-items: flex-end;    
  height: 54px;
`
