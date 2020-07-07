import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Button from '@material-ui/core/Button'

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

export const TypographyStyled = styled(Typography)`
  && {
    font-weight: bold;
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
`
