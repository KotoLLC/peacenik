import React from 'react'
import { connect } from 'react-redux'
import { ApiTypes } from 'src/types'
import Actions from '@store/actions'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { ListItemIconStyled, MenuItemWrapper } from '@view/shared/styles'
import { ListItemTextStyled } from './styles'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  ModalSubTitle,
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
} from '@view/shared/ModalDialog/styles'

interface Props {
  id: string
  sourceHost: string

  onHideMessage: (data: ApiTypes.Feed.Hide) => void
}

const HideMessageDialog: React.SFC<Props> = (props) => {
  const [isOpen, setOpen] = React.useState(false)
  const { onHideMessage, id, sourceHost } = props

  const onHide = () => {
    onHideMessage({
      host: sourceHost,
      id: id
    })
    setOpen(false)
  }

  return (
    <>
      <MenuItemWrapper onClick={() => setOpen(true)}>
        <ListItemIconStyled>
          <VisibilityOffIcon fontSize="small" />
        </ListItemIconStyled>
        <ListItemTextStyled primary="Hide" />
      </MenuItemWrapper>
      <ModalDialog
        isModalOpen={isOpen}
        setOpenModal={() => setOpen(!isOpen)}
      >
        <ModalSubTitle>Are you sure, there is no way to undo this?</ModalSubTitle>
        <ModalButtonsGroup>
          <ModalCancelButton onClick={() => setOpen(false)}>
            Cancel
        </ModalCancelButton>
          <ModalAllowButton onClick={onHide}>
            Hide
        </ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
    </>
  )
}

type DispatchProps = Pick<Props, 'onHideMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onHideMessage: (data: ApiTypes.Feed.Hide) => dispatch(Actions.feed.hideFeedMessageRequest(data)),
})

export default connect(null, mapDispatchToProps)(HideMessageDialog)