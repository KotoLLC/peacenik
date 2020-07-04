import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

export const TooltipStyle = styled(Tooltip)`
  && {
    margin-left: auto;
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