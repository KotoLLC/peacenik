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

export const LogoWrapper = styled(Link)`
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
`

export const Logo = styled.img`
  max-height: 42px;
  position: relative;
  top: 3px;

  @media (max-width: 800px){
    display: none;
  }
`

export const LogoMobile = styled.img`
  display: none;

  @media (max-width: 800px){
    position: relative;
    top: 0px;
    left: -5px;
    display: block;
    max-height: 40px;
  }
`

export const ListItemIconStyled = styled(ListItemIcon)`
  && {
    min-width: 40px;
  }
`

export const MenuButton = styled(Button)`
  && {
    color: #fff;
  }
`

export const TopBarRightSide = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

export const PageWrapper = styled.main`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 20px;

  @media (max-width: 600px) {
    padding: 0px;
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

export const NotificationsWrapper = styled(Link)`
  display: flex;
  cursor: pointer;
  color: #fff;
  margin-right: 10px;

  &:hover {
    text-decoration: none;
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

export const AvatarWrapper = styled(Link)`
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  width: 40px;
  height: 40px;
  margin: 0 10px;
`

export const ErrorMessage = styled.div`
  font-size: 14px;
  color: red;
  margin-top: 20px;
`