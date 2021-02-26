import styled from 'styled-components'
import { ButtonContained } from '@view/shared/styles'
import { TextField } from '@material-ui/core'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'

export const LogoImage = styled.img`
  max-width: 162px;
	width: 100%;
`

export const LogoImageWrapper = styled.figure`
  margin-bottom: -145px;
	position: relative;
	z-index: 10;
`

export const WelcomeLogoWrapper = styled.figure`
	position: relative;
	z-index: 10;
	margin-bottom: 30px;
`

export const AuthWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	padding: 65px 0;
	max-width: 360px;
	width: calc(100% - 30px);
	margin: 0 auto;
`

export const AuthTitle = styled.h1`
	color: #585F6F;
	font-family: 'SFUITextBold';
	margin-bottom: 30px;
	font-size: 28px;
	text-align: center;
`

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
	width: 100%;
  padding: 25px 30px;
  align-items: center;
	box-shadow: 0px 1px 3px #D4D4D4;
	position: relative;
`

export const FormSubtitle = styled.div`
	padding: 128px 0 0;
	font-family: 'SFUITextMedium';
	font-style: normal;
	font-weight: 100;
	font-size: 14px;
	line-height: 21px;
	text-align: center;
	color: #585F6F;
	margin-bottom: 16px;
`

export const ConfirmMessage = styled(FormSubtitle)`
	padding: 0;
`

export const TextFieldNote = styled.div`
	font-family: 'SFUITextMedium';
	font-size: 12px;
	line-height: 18px;
	color: #A1AEC8;
	margin: -4px 0 14px;
`

export const Separator = styled.div`
	width: 100%;
	padding: 24px 0; 
	text-align: center;
	font-family: 'SFUITextBold';
	font-size: 14px;
	line-height: 17px;
	text-align: center;
	color: #585F6F;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;

	&:before {
		display: inline-block;
		height: 1px;
		width: 126px;
		background: linear-gradient(90deg, rgba(247, 248, 249, 0.0001) 0%, #BEC4CC 59.24%);
		transform: matrix(1, 0, 0, -1, 0, 0);
		content: '';
	}

	&:after {
		display: inline-block;
		height: 1px;
		width: 126px;
		background: linear-gradient(90deg, rgba(247, 248, 249, 0.0001) 0%, #BEC4CC 59.24%);
		transform: rotate(-180deg);
		content: '';
	}
`

export const LinkBlock = styled.div`
	width: 100%;
	height: 63px;
	background-color: #FFFFFF;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: 'SFUITextRegular';
	font-style: normal;
	font-weight: 100;
	font-size: 16px;
	line-height: 19px;
	color: #262626;
	box-shadow: 0px 1px 3px #D4D4D4;
	
	a {
			font-family: 'SFUITextBold';
			font-size: 16px;
			color: #599C0B;
			padding-left: 10px;
	}
`

export const SubmitButton = styled(ButtonContained)`
	max-width: 266px;
	width: 100%;
`

export const TextFieldStyled = styled(TextField)`
	&& {
		font-family: 'SFUITextMedium';
		text-align: center;
		color: #585F6F;
		width: 100%;
		margin-bottom: 16px;

		fieldset {
			transition: 0.2s;
		}

		.Mui-focused fieldset {
      border: 1px solid #000;
    }
	}

	> div {
			height: 40px;
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
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	width: 100%;
`

export const LabelLink = styled(Link)`
	font-family: 'SFUITextRegular';
	font-size: 12px;
	color: #A1AEC8;
	cursor: pointer;
	transition: 0.2s;

	&:hover {
		text-decoration: underline;
	}
`

export const CloseButton = styled(IconButton)`
	&& {
		position: absolute;
		right: 0;
		top: 0;

		svg {
			color: #A1AEC8;
		}
	}
`

export const SuccessIcon = styled.img`
	width: 80px;
	height: 80px;
`

export const SuccessIconWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 130px auto 20px;
	height: 124px;
	width: 124px;
	box-shadow: 0px 1px 10px 2px rgba(216, 216, 216, 0.3);
	border-radius: 24px;
`

export const FormLink = styled(Link)`
	display: inline-block;
	margin-right: auto;
	color: #599C0B;
	font-family: 'SFUITextMedium';
	text-decoration: underline;
	font-size: 12px;
	margin-bottom: 16px;
`