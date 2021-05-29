import React from 'react';
import { ModalCropImgStyled } from './styles';
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

interface Props {
  title?: string
  isModalOpen: boolean
  setOpenModal: (value: boolean) => void
}

const CoverBkImgCropDialog: React.FC<Props> = (props) => {
  const { title, isModalOpen, setOpenModal } = props

  return (
    <ModalCropImgStyled
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
        <>
          {props.children}
        </>
      </Fade>
    </ModalCropImgStyled>
  );
};

export default CoverBkImgCropDialog;