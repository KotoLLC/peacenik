import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Select from '@material-ui/core/Select'
import { 
  EditFormWrapper,
  EditFieldWrapper,
  EditFieldPlaceholder,
  ButtonContained,
  ButtonOutlined,
} from '@view/shared/styles'

export const SettingsContainer = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  max-width: 1170px;
  width: 100%;
  margin: 65px auto 0;
  padding: 30px 15px 30px;

  @media (max-width: 770px) {
    flex-wrap: wrap;
    margin-top: 50px;
    padding: 10px 15px 15px;
}
`

export const SettingsContentWrapper = styled.div`
  width: calc(100% - 262px);
  display: flex;
  flex-wrap: wrap;
  padding-left: 30px;

  @media (max-width: 770px) {
    width: 100%;
    padding-left: 0;
  }
`

export const ProfileSettingsContent = styled.div`
  background: #FFFFFF;
  box-shadow: 0px 1px 3px #D4D4D4;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`

export const SettingsFormWrapper = styled(EditFormWrapper)`
  padding: 30px 170px 30px 140px;

  @media (max-width: 1025px) {
    padding: 30px 30px 30px 30px;
  }

  @media (max-width: 770px){
    padding: 30px 15px 20px;
  }
`

export const SettingsFieldWrapper = styled(EditFieldWrapper)`
  margin-bottom: 20px;

  @media (max-width: 770px){
    margin-bottom: 10px;
  }

`

export const SettingsFieldPlaceholder = styled(EditFieldPlaceholder)`
  font-size: 14px;
  width: auto;
  min-width: 160px;
`

export const TextFieldStyled = styled(TextField)`
	&& {
		font-family: 'SFUITextMedium';
		text-align: center;
		color: #585F6F;
		width: 100%;

		fieldset {
			transition: 0.2s;
		}

		.Mui-focused fieldset {
      border: 1px solid #000;
    }
	}

	> div {
			height: 36px;
	}
	
	input {
		font-family: 'SFUITextMedium';
		font-size: 14px;
		color: #262626;

		&::placeholder {
			font-family: 'SFUITextMedium';
			font-size: 14px;
			color: #585F6F;
		}
	}
	
	svg {
		color: #A1AEC8;
    margin-right: 10px;
	}
  
`

export const CheckboxFieldWrapper = styled.div`
  padding-left: 162px;
  margin-bottom: 20px;

  @media (max-width: 770px){
    padding-left: 0;
  }
`

export const ButtonContainedStyled = styled(ButtonContained)`
  min-width: 200px;

  @media (max-width: 770px){
    min-width: 180px;
  }
` 

export const FormTitle = styled.h3`
  font-family: 'SFUITextRegular';
  font-size: 16px;
  padding-left: 160px;
  margin-bottom: 20px;

  @media (max-width: 770px){
    padding-left: 0;
  }
`

export const HubSettingsBlock = styled.div`
  padding: 30px;
  position: relative;

  &:after {
    content: '';
    height: 1px;
    width: calc(100% - 60px);
    position: absolute;
    bottom: 0;
    left: 30px;
    background: rgba(200, 207, 212, 0.6);
  }


  &:last-child {
    &:after {
      display: none;
    }
  }

  @media (max-width: 770px){
    padding: 20px 15px;

    &:after {
      width: calc(100% - 30px);
      left: 15px;
    }
  }
`

export const HubMajorInfo = styled.div`
  text-align: center;
`

export const CircleIconWrapper = styled.div`
  width: 108px;
  height: 108px;
  margin: 0 auto 16px;

  @media (max-width: 770px){
    transform: scale(0.9);
    margin-bottom: 5px;
  }
`

export const HubName = styled.h3`
  font-family: 'SFUITextMedium';
  font-size: 24px;
  margin-bottom: 5px;
  text-align: center;

  @media (max-width: 770px){
    font-size: 18px;
  }
`

export const HubStatus = styled.div`
  font-family: 'SFUITextMedium';
  color: #A1AEC8;
  text-align: center;

  span {
    font-family: 'SFUITextSemibold';

    &.online {
      color: #599C0B;
    }
  }

  @media (max-width: 770px){
    font-size: 14px;
  }
`

export const HubLinkWrapper = styled.div`
  text-align: center;
  margin-bottom: 15px;

  @media (max-width: 770px){
    margin-bottom: 5px;
  }
`

export const HubPath = styled.span`
  color: #0076FF;
  font-family: 'SFUITextMedium';
  text-decoration: underline;

  @media (max-width: 770px){
    font-size: 14px;
  }
`

export const CreationHubWrapper = styled.div`
  text-align: center;
`

export const CreationHubTitle = styled.h3`
  font-family: 'SFUITextBold';
  margin-bottom: 30px;
`

export const CreationHubStepsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: 1025px) {
    justify-content: center;
  }
`

export const CreationHubStepWrapper = styled.div`
  width: 200px;
  padding-top: 50px;
  position: relative;

  @media (max-width: 1025px){
   margin-bottom: 34px;
   margin: 0 10px 30px;
   /* width: 40%;  */
  }

  @media (max-width: 770px){
    width: 200px;
  }
`

export const CreationHubStepIcon = styled.img`
  width: 40px;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
`

export const CreationHubStepDescription = styled.p`
  font-size: 14px;
`

export const CreationHubNote = styled.p`
  margin-top: 50px;

  b {
    font-family: 'SFUITextBold';
    color: #599C0B;  
  }

  @media (max-width: 770px){
    font-size: 14px;
    margin-top: 10px;
  }
`

export const HubLink = styled(Link)`
  font-family: 'SFUITextBold';
  color: #599C0B;
`

export const HubOptionTitle = styled.h2`
  color: #599C0B;
  font-size: 21px;
  margin-bottom: 20px;
  font-family: 'SFUITextBold';
  text-decoration: underline;

  @media (max-width: 770px){
    font-size: 17px;
    margin-bottom: 10px;
  }
`

export const HubOptionText = styled.p`

  @media (max-width: 770px){
    font-size: 14px;
  }
`

export const ButtonWrapper = styled.div`
  margin-top: 50px;

  @media (max-width: 770px){
    margin-top: 20px;
  }
`

export const ButtonNote = styled.div`
  color: #A1AEC8;
  font-family: 'SFUITextMedium';
  font-size: 12px;
  margin-top: 8px;
  padding-left: 14px;

  @media (max-width: 770px){
    padding-left: 11px;
  }
`

export const HubFieldWrapper = styled.div`
  margin-top: 24px;

  @media (max-width: 770px){
    margin-top: 15px;
  }
`

export const SelectFieldWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 770px){
    flex-wrap: wrap;
  }
`

export const HubFieldLabel = styled.p`
  font-size: 14px;
  width: 100%;
  margin-bottom: 8px;
`

export const HubFieldNote = styled.p`
  font-size: 12px;
  color: #A1AEC8;
  margin-bottom: 10px;
`

export const HubFieldInput = styled.input`
  border: 1px solid #C8CFD4;
  box-sizing: border-box;
  font-size: 14px;
  height: 32px;
  padding: 0 10px;
  margin-right: 10px;
  width: 370px;
  font-family: 'SFUITextMedium';
  border-radius: 4px;
  color: #599C0B;
  outline: none; 

  &::placeholder {
    font-size: 14px;
    font-family: 'SFUITextMedium';
    color: #599C0B;
  }

  &.error {
    color: red;
    border-color: red;

    &::placeholder {
      color: red;
    }
  }

  @media (max-width: 770px){
    width: 100%;
    margin: 0 0 15px;
  }
`

export const SelectStyled = styled(Select)`
  && {
    margin: 0 10px;
    width: 275px;

    .MuiSelect-selectMenu {
      min-height: 30px;
      line-height: 30px;
      padding: 0px 30px 0 14px;
    }

    @media (max-width: 770px){
      width: 100%;
      margin: 0 0 15px;
    }
  }
`

export const DestroyHubButton = styled(ButtonOutlined)`
  width: 185px;
  margin: 50px auto 0;

  @media (max-width: 770px){
    margin-top: 20px;
  }
`