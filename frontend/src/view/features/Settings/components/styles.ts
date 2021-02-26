import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import { 
  EditFormWrapper,
  EditFieldWrapper,
  EditFieldPlaceholder,
  ButtonContained,
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
`

export const SettingsFieldWrapper = styled(EditFieldWrapper)`
  margin-bottom: 20px;

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
	}
`

export const CheckboxFieldWrapper = styled.div`
  padding-left: 162px;
`

export const ButtonContainedStyled = styled(ButtonContained)`
  min-width: 200px;
` 