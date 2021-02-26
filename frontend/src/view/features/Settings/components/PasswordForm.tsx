import React, { useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import LockIcon from '@material-ui/icons/Lock'
import {
  ErrorMessage,
  EditButtonsWrapper,
} from '@view/shared/styles'
import {
  SettingsFormWrapper,
  SettingsFieldWrapper,
  SettingsFieldPlaceholder,
  TextFieldStyled,
  ButtonContainedStyled,
} from './styles'

export const PasswordForm = () => {
  const [isRequested, setRequested] = useState<boolean>(false)
  const [isPasswordVisible, onPasswordOpen] = useState<boolean>(false)

  return (
    <>
      <SettingsFormWrapper>
        <SettingsFieldWrapper>
          <SettingsFieldPlaceholder>Current password</SettingsFieldPlaceholder>
          <TextFieldStyled
            variant="outlined"
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            // value={password}
            // onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            // error={(noValideField === 'password') ? true : false}
            InputProps={{
              startAdornment: (
                <LockIcon />
              ),
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onPasswordOpen(!isPasswordVisible)}
                  onMouseDown={() => onPasswordOpen(!isPasswordVisible)}
                  edge="end"
                >
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />
        </SettingsFieldWrapper>
        <SettingsFieldWrapper>
          <SettingsFieldPlaceholder>New password</SettingsFieldPlaceholder>
          <TextFieldStyled
            variant="outlined"
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            // value={password}
            // onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            // error={(noValideField === 'password') ? true : false}
            InputProps={{
              startAdornment: (
                <LockIcon />
              ),
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onPasswordOpen(!isPasswordVisible)}
                  onMouseDown={() => onPasswordOpen(!isPasswordVisible)}
                  edge="end"
                >
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />
        </SettingsFieldWrapper>
        <SettingsFieldWrapper>
          <SettingsFieldPlaceholder>Confirm password</SettingsFieldPlaceholder>
          <TextFieldStyled
            variant="outlined"
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            // value={password}
            // onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            // error={(noValideField === 'password') ? true : false}
            InputProps={{
              startAdornment: (
                <LockIcon />
              ),
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onPasswordOpen(!isPasswordVisible)}
                  onMouseDown={() => onPasswordOpen(!isPasswordVisible)}
                  edge="end"
                >
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />
        </SettingsFieldWrapper>
        {false && <ErrorMessage>error message here</ErrorMessage>}
        <EditButtonsWrapper>
          <ButtonContainedStyled disabled={isRequested} onClick={() => { }}>
            {isRequested ? <CircularProgress size={20} color={'inherit'} /> : 'Change password'}
          </ButtonContainedStyled>
        </EditButtonsWrapper>
      </SettingsFormWrapper>
    </>
  )
}