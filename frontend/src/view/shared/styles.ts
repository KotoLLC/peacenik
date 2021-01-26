import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { Link } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

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
  display: flex;
  flex-wrap: wrap;
  padding: 0px 0px 170px;

  @media (max-width: 600px) {
    padding: 0px 0 120px;
  }
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
  margin: 0 10px;
  cursor: pointer;

  @media (max-width: 700px){
    transform: scale(0.7);
    margin: 0;
  }
`

export const ErrorMessage = styled.div`
  font-size: 14px;
  color: red;
  margin-top: 20px;
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
  max-width: 800px;
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

export const ButtonContained = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 120px;
  height: 32px;
  background: #599C0B;
  border-radius: 16px;
  font-family: 'SFUITextMedium';
  text-align: center;
  color: #fff;
  font-size: 14px;
  transition: 0.15s;
  text-decoration: none;
  outline: none;
  cursor: pointer;

  &.large {
    min-width: 160px;
  }
  
  &.small {
    height: 30px;
    min-width: 110px;
    font-size: 12px;
  }

  &.extra-small {
    height: 26px;
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
  
`

export const ButtonOutlined = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  min-width: 120px;
  height: 32px;
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

  &.large {
    min-width: 160px;
  }

  &.small {
    height: 30px;
    min-width: 110px;
    font-size: 12px;
  }
  
  &.extra-small {
    height: 26px;
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
`