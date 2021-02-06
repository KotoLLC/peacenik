import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'

export const CreateGroupContainer = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  flex-wrap: wrap;
  width: calc(100% - 30px);
  max-width: 750px;
  margin: 95px auto 30px;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px #D4D4D4;

  @media (max-width: 770px) {
    margin: 60px auto 0px
  }
`

export const CoverWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 200px;
  width: 100%;
  background-color: #A1AEC8;
  background-image:  ${props => `url(${props.resource})`};
  background-position: center;
  background-size: cover;

  @media (max-width: 770px){
    height: 100px;
    
    label {
      margin-left: 30px;
    }
  }
`

export const CoverIconWrapper = styled.figure`
  border: 2px solid #FFFFFF;
  width: 72px;
  height: 72px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media (max-width: 770px){
    width: 36px;
    height: 36px;
    border: 1px solid #FFFFFF;

    img {
      width: 16px;
    }
  }
`

export const AddCoverButtonWrapper = styled.div`
  text-align: center;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 770px){
    margin-top: 5px;
  }
`

export const AddCoverButton = styled.span`
  display: inline-block;
  font-family: 'SFUITextMedium';
  color: #fff;
  font-size: 16px;
  padding-bottom: 2px;
  line-height: 16px;
  position: relative;
  cursor: pointer;

  &:after {
    display: inline-block;
    content: '';
    width: 100%;
    height: 1px;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    transition: 0.15s;
    opacity: 1;
  }

  &:hover {
    &:after {
      opacity: 0;
    }
  }

  @media (max-width: 770px){
    font-size: 12px;
  }
`

export const AvatarStyled = styled(Avatar)`
  background: #DEE5F2;
  border: 4px solid #FFFFFF;
  width: 140px;
  height: 140px;
  cursor: pointer;
  margin-left: 23px;

  @media (max-width: 770px){
    width: 90px;
    height: 90px;
    border: 2px solid #FFFFFF;
    margin-left: 15px;

    .avatar-icon {
      width: 24px;
    }
  }
`

export const AvatarsBlock = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: -72px;
  width: 100%;

  @media (max-width: 770px) {
    margin-top: -45px;
  }
`

export const AvatarsNote = styled.div`
  color: #A1AEC8;
  font-size: 12px;
  padding-bottom: 26px;
  margin-left: 15px;

  @media (max-width: 770px){
    padding-bottom: 15px;
  }
`

export const FormWrapper = styled.form`
  padding: 30px 97px 30px 60px;
  width: 100%; 

  @media (max-width: 770px) {
    padding: 15px 15px 20px;
  }
`

export const FieldWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  &.radios {
    align-items: flex-start;
  }

  @media (max-width: 770px) {
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
`

export const FieldPlaceholder = styled.span`
  color: #A1AEC8;
  padding-right: 20px;
  text-align: right;
  width: 130px;

  &.radios {
    /* padding-right: 9px; */
  }

  @media (max-width: 770px) {
    text-align: left;
    padding-right: 0;
    margin-bottom: 10px;
    font-size: 14px;
  }
`

export const InputField = styled.input`
  border: 1px solid #C8CFD4;
  border-radius: 4px;
  height: 30px;
  width: 460px;
  padding: 0 10px;
  outline: none;
  transition: 0.15s;
  color: #262626;
  font-size: 14px;
  font-family: 'SFUITextMedium';

  &:focus {
    border-color: #A1AEC8;
  }

  @media (max-width: 770px) {
    width: 100%;
  }
`

export const TextareaField = styled.textarea`
  border: 1px solid #C8CFD4;
  border-radius: 4px;
  height: 80px;
  width: 460px;
  padding: 4px 10px;
  outline: none;
  transition: 0.15s;
  color: #262626;
  font-size: 14px;
  font-family: 'SFUITextMedium';
  resize: none;

  &:focus {
    border-color: #A1AEC8;
  }

  @media (max-width: 770px) {
    width: 100%;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const RadioStyled = styled(Radio)`
  && {
    color: #599C0B;
    padding: 0 9px 0 0;

    &:checked {
      color: #599C0B;     
    }
  }
`

export const FormControlLabelStyled = styled(FormControlLabel)`
  
  && {
    margin-right: 30px;
    align-items: flex-start;
  }

  .title {
    width: 100px;
    font-size: 14px;
    font-family: 'SFUITextSemibold';
    position: relative;
  }

  .title-note {
    display: block;
    left: 0;
    bottom: -14px;
    font-size: 10px;
    color: #A1AEC8;
  }
  
`

export const RadiosWrapper = styled.div`
  display: flex;
  margin-bottom: 2px;
  margin-left: 9px;
`