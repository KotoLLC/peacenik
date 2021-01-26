import styled from 'styled-components'
import Modal from '@material-ui/core/Modal'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { ButtonOutlined, ButtonContained } from '@view/shared/styles'

export const ModalStyled = styled(Modal)`
  position: relative;
  background: rgba(38,38,38,0.6);
  outline: none;
`

export const ModalViewport = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 18px 45px 31px 45px;
  width: 555px;
  background: #FFFFFF;
  border: none;
  outline: none;
`

export const ModalCloseBtn = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
    transition: 0.2s;
  }
`

export const ModalTitle = styled.div`
  font-family: 'SFUITextBold';
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  margin-bottom: 44px;
`

export const ModalSubTitle = styled.div`
  text-align: center;
  font-size: 18px;
`

export const ModalEmailInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    width: 100%;
    border-radius: 4px;
    height: 36px;

    &:hover fieldset {
      border-color: #C8CFD4;
    }

    &.Mui-focused fieldset {
      border-color: #C8CFD4;
      font-family: SFUITextMedium;
      font-size: 14px;
      line-height: 16px;
      color: #262626;
    }
  }

  & .MuiInputAdornment-root {
    svg {
      color: #A1AEC8;
    }
  }
`

export const ModalButtonsGroup = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
`

export const ModalCancelButton = styled(ButtonOutlined)`
  width: 200px;
  height: 36px;
  font-size: 16px;
  line-height: 19px;
`

export const ModalAllowButton = styled(ButtonContained)`
  width: 200px;
  height: 36px;
  font-size: 16px;
  line-height: 19px;
`

export const TextFieldWrapper = styled.div`
  max-width: 460px;
  width: 100%;
`

export const TextFieldLabel = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: #A1AEC8;
  font-family: 'SFUITextRegular';
`

export const TextareaStyled = styled.textarea`
  width: 100%;
  border: 1px solid #C8CFD4;
  outline: none;
  box-sizing: border-box;
  border-radius: 4px;
  height: 70px;
  resize: none;
  font-family: 'SFUITextMedium';
  color: #262626;
  padding: 8px 10px;
`