import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'

export const CreateGroupContainer = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  flex-wrap: wrap;
  width: 750px;
  margin: 95px auto 30px;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px #D4D4D4;
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
  background-size: cover;
  background-position: center center;
`

export const CoverIconWrapper = styled.figure`
  border: 2px solid #FFFFFF;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export const AddCoverButtonWrapper = styled.div`
  text-align: center;
  width: 100%;
  margin-top: 20px;
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
`

export const AvatarStyled = styled(Avatar)`
  background: #DEE5F2;
  border: 4px solid #FFFFFF;
  width: 140px;
  height: 140px;
  cursor: pointer;
  margin-left: 23px;
`

export const AvatarsBlock = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: -72px;
  width: 100%;
`

export const AvatarsNote = styled.div`
  color: #A1AEC8;
  font-size: 12px;
  padding-bottom: 26px;
  margin-left: 15px;
`

export const FormWrapper = styled.form`
  padding: 30px 97px 30px 60px;
  width: 100%;
`

export const FieldWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  &.radios {
    align-items: flex-start;
  }
`

export const FieldPlaceholder = styled.span`
  color: #A1AEC8;
  padding-right: 20px;
  text-align: right;
  width: 130px;

  &.radios {
    padding-top: 8px;
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
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const RadioStyled = styled(Radio)`
  && {
    color: #599C0B;

    &:checked {
      color: #599C0B;     
    }
  }
`

export const FormControlLabelStyled = styled(FormControlLabel)`
  
  && {
    margin-right: 30px;
  }

  .title {
    width: 100px;
    font-size: 14px;
    font-family: 'SFUITextSemibold';
    position: relative;
  }

  .title-note {
    display: block;
    position: absolute;
    left: 0;
    bottom: -14px;
    font-size: 10px;
    color: #A1AEC8;
  }
  
`

export const RadiosWrapper = styled.div`
  display: flex;
  margin-bottom: 2px;
`