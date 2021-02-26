import React, { useState } from 'react'
import CoverIcon from '@assets/images/groups-cover-icon.svg'
import CircularProgress from '@material-ui/core/CircularProgress'
import PersonIcon from '@material-ui/icons/Person'
import FaceIcon from '@material-ui/icons/Face'
import MailIcon from '@material-ui/icons/Mail'
import Checkbox from '@material-ui/core/Checkbox'
import {
  EditCoverWrapper,
  EditCoverIconWrapper,
  EditCoverAddButton,
  EditCoverAddButtonWrapper,
  UploadInput,
  EditsAvatar,
  EditsAvatarWrapper,
  EditButtonsWrapper,
  ErrorMessage,
  CheckboxLabel,
} from '@view/shared/styles'
import {
  SettingsFormWrapper,
  SettingsFieldWrapper,
  SettingsFieldPlaceholder,
  TextFieldStyled,
  CheckboxFieldWrapper,
  ButtonContainedStyled,
} from './../components/styles'

export const ProfileForm = () => {
  const [isRequested, setRequested] = useState<boolean>(false)
  const [coverFileObjectUrl, setCoverFileObjectUrl] = useState<string>('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isAvatarFileUploaded, setAvatarUploadedFile] = useState<boolean>(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const renderAvatar = () => {
    if (avatarFile) {
      return (
        <EditsAvatar src={URL.createObjectURL(avatarFile)} />
      )
    }

    return (
      // <EditsAvatar src={initialGroup?.id ? getGroupAvatarUrl(initialGroup?.id) : ''} />
      <EditsAvatar src={''} />
    )
  }

  return (
    <>

      {/* <EditCoverWrapper resource={(coverFile) ? coverFileObjectUrl : getGroupCoverUrl(initialGroup?.id!)}> */}
      <EditCoverWrapper>
        <label>
          <EditCoverIconWrapper>
            <img src={CoverIcon} alt="icon" />
          </EditCoverIconWrapper>
          <EditCoverAddButtonWrapper>
            <EditCoverAddButton>Add cover picture</EditCoverAddButton>
          </EditCoverAddButtonWrapper>
          <UploadInput
            type="file"
            id="cover"
            name="cover"
            // onChange={onCoverFileUpload}
            onChange={() => { }}
            accept="image/*"
          />
        </label>
      </EditCoverWrapper>
      <EditsAvatarWrapper>
        <label>
          {renderAvatar()}
          <UploadInput
            type="file"
            id="file"
            name="file"
            // onChange={onAvatarFileUpload}
            onChange={() => { }}
            accept="image/*"
          />
        </label>
      </EditsAvatarWrapper>
      <SettingsFormWrapper>
        <SettingsFieldWrapper>
          <SettingsFieldPlaceholder>Full name</SettingsFieldPlaceholder>
          <TextFieldStyled
            variant="outlined"
            // placeholder="Password"
            id="userName"
            value={''}
            // onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            // error={(noValideField === 'password') ? true : false}
            InputProps={{
              startAdornment: (
                <PersonIcon />
              )
            }}
          />
        </SettingsFieldWrapper>
        <SettingsFieldWrapper>
          <SettingsFieldPlaceholder>Username</SettingsFieldPlaceholder>
          <TextFieldStyled
            variant="outlined"
            // placeholder="Password"
            id="userName"
            value={''}
            // onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            // error={(noValideField === 'password') ? true : false}
            InputProps={{
              startAdornment: (
                <FaceIcon />
              )
            }}
          />
        </SettingsFieldWrapper>
        <SettingsFieldWrapper>
          <SettingsFieldPlaceholder>Email</SettingsFieldPlaceholder>
          <TextFieldStyled
            variant="outlined"
            id="userName"
            value={''}
            // onChange={(event) => onPasswordChange(event.currentTarget.value.trim())}
            // error={(noValideField === 'password') ? true : false}
            InputProps={{
              startAdornment: (
                <MailIcon />
              )
            }}
          />
        </SettingsFieldWrapper>
        <CheckboxFieldWrapper>
          <CheckboxLabel
            control={
              <Checkbox
                // checked={isRememberedMe}
                // onChange={(event) => onRememberMeChange(event.target.checked)}
                name="rememberMe"
                color="primary"
              />
            }
            label="Hide my profile. Only your friends can see real name and profile page"
          />
        </CheckboxFieldWrapper>
        {false && <ErrorMessage>error message here</ErrorMessage>}
        <EditButtonsWrapper>
          <ButtonContainedStyled disabled={isRequested} onClick={() => { }}>
            {isRequested ? <CircularProgress size={20} color={'inherit'} /> : 'Save changes'}
          </ButtonContainedStyled>
        </EditButtonsWrapper>
      </SettingsFormWrapper>
    </>
  )
}