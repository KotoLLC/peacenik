import React from 'react'
import { ReactComponent as CloseIcon } from '@assets/images/close-icon.svg'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import {
  ModalStyled,
  ModalViewport,
  ModalTitle,
  ModalCloseBtn,
} from './styles'

interface Props {
  title?: string
  isModalOpen: boolean
  setOpenModal: (value: boolean) => void
}

export const ModalDialog: React.FC<Props> = (props) => {
  const { title, isModalOpen, setOpenModal } = props

  return (
    <ModalStyled
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      open={isModalOpen}
      onClose={setOpenModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade in={isModalOpen}>
        <ModalViewport>
          <ModalCloseBtn>
            <CloseIcon onClick={() => setOpenModal(false)} />
          </ModalCloseBtn>
          {title && <ModalTitle>{title}</ModalTitle>}
          {props.children}
        </ModalViewport>
      </Fade>
    </ModalStyled>
  )
} 