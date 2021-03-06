import React, { ChangeEvent, FormEvent } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from 'src/types'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { validate } from '@services/validation'
import FormHelperText from '@material-ui/core/FormHelperText'
import Actions from '@store/actions'
import IconButton from '@material-ui/core/IconButton'
import { getAvatarUrl } from '@services/avatarUrl'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import loadImage from 'blueimp-load-image'

import {
  UserContentWrapper,
  AvatarWrapper,
  FormWrapper,
  AvatarLabel,
  FormControlStyled,
  UploadInput,
  FieldNote,
  ProfileWrapper,
  Header,
  Title,
} from './styles'

interface Props {
  userName: string
  userFullName: string
  userEmail: string
  userId: string
  avatarUploadLink: ApiTypes.UploadLink | null
  profileErrorMessage: string

  onGetUploadLink: (value: ApiTypes.UploadLinkRequest) => void
  onSetAvatar: (data: ApiTypes.Profile.Avatar) => void
  onEditProfile: (data: ApiTypes.Profile.EditProfile) => void
  onGetProfile: () => void
}

type FieldsType = 'newPassword' | 'currentPassword' | 'email' | ''

interface State {
  email: string | null
  isRequestSend: boolean
  errorMessage: string
  isFileUploaded: boolean
  file: File | null
  fullName: string
  currentPassword: string
  newPassword: string
  noValideField: FieldsType
  isCurrentPasswordVisible: boolean
  isNewPasswordVisible: boolean
}

class MyProfile extends React.PureComponent<Props, State> {

  state = {
    email: null,
    isRequestSend: false,
    errorMessage: '',
    isFileUploaded: false,
    file: null,
    fullName: this.props?.userFullName || '',
    currentPassword: '',
    newPassword: '',
    noValideField: '' as FieldsType,
    isCurrentPasswordVisible: false,
    isNewPasswordVisible: false,
  }

  onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: event.currentTarget.value.trim(),
    })
  }

  onFullNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fullName: event.currentTarget.value,
    })
  }

  onCurrentPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      currentPassword: event.currentTarget.value.trim(),
    })
  }

  onNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newPassword: event.currentTarget.value.trim(),
    })
  }

  onValidate = (): boolean => {
    const { email, currentPassword, newPassword } = this.state

    if (!email) {
      this.setState({
        errorMessage: 'The email can\'t be empty',
        noValideField: 'email',
      })
      return false
    }

    if (email && !validate.isEmailValid(email!)) {
      this.setState({
        errorMessage: 'Incorrect email',
        noValideField: 'email',
      })
      return false
    }

    if (currentPassword || newPassword) {
      if (newPassword && !currentPassword) {
        this.setState({
          errorMessage: 'Enter Your current password',
          noValideField: 'currentPassword',
        })
        return false
      }

      if (!validate.isPasswordValid(newPassword)) {
        this.setState({
          errorMessage: 'New password is incorrect',
          noValideField: 'newPassword',
        })
        return false
      }
    }

    return true
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    
    const { email, currentPassword, newPassword, fullName } = this.state
    const { avatarUploadLink, userEmail, onEditProfile, userFullName } = this.props

    if (!this.onValidate()) return

    let avatarData = {}
    let emailData = {}
    let passwordData = {}
    let fullNameData = {}

    if (avatarUploadLink?.blob_id) {
      avatarData = {
        avatar_changed: true,
        avatar_id: avatarUploadLink.blob_id
      }
    }

    if (email !== userEmail) {
      emailData = {
        email_changed: true,
        email: email,
      }
    }
    
    if (fullName !== userFullName) {
      fullNameData = {
        full_name_changed: true,
        full_name: fullName,
      }
    }

    if (newPassword) {
      passwordData = {
        password_changed: true,
        current_password: currentPassword,
        new_password: newPassword,
      }
    }
    
    const data = { ...emailData, ...avatarData, ...passwordData, ...fullNameData }
    onEditProfile(data)

    this.setState({
      isRequestSend: true,
      errorMessage: '',
      noValideField: '',
    })
  }

  onAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetUploadLink } = this.props

    this.setState({
      isFileUploaded: false,
    })

    const file = event.target.files

    if (file && file[0]) {
      onGetUploadLink({
        content_type: file[0].type,
        file_name: file[0].name,
      })

      const self = this

      /* tslint:disable */
      loadImage(
        file[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                self.setState({
                  file: newBlob,
                })
              })
            }, 'image/jpeg')
          } else {
            self.setState({
              file: file[0],
            })
          }
        },
        { meta: true, orientation: true, canvas: true }
      )
      /* tslint:enable */

    }
  }

  onCurrentPasswordOpen = (value: boolean) => {
    this.setState({
      isCurrentPasswordVisible: value
    })
  }

  onNewPasswordOpen = (value: boolean) => {
    this.setState({
      isNewPasswordVisible: value
    })
  }

  static getDerivedStateFromProps(newProps: Props, prevState: State) {

    if (newProps?.avatarUploadLink && prevState?.file) {

      const { form_data } = newProps?.avatarUploadLink
      const data = new FormData()

      for (let key in form_data) {
        data.append(key, form_data[key])
      }

      data.append('file', prevState?.file, prevState?.file.name)

      newProps.onSetAvatar({
        link: newProps?.avatarUploadLink.link,
        form_data: data,
      })

      return {
        isFileUploaded: true
      }
    }

    if (newProps.profileErrorMessage) {
      return {
        errorMessage: newProps.profileErrorMessage,
      }
    }

    if (prevState.email) {
      return {
        email: prevState.email
      }
    }

    if (prevState.email === null && newProps.userEmail) {
      return {
        email: newProps.userEmail
      }
    }

    return null
  }

  renderAvatar = () => {
    const { file } = this.state
    const { userName, userId } = this.props

    if (file) {
      return <img src={URL.createObjectURL(file)} alt={userName} />
    }

    return <img src={getAvatarUrl(userId)} alt={userName} />
  }

  componentDidMount() {
    this.props.onGetProfile()
  }

  render() {
    const { userName, userFullName } = this.props
    
    const {
      errorMessage,
      email,
      noValideField,
      currentPassword,
      newPassword,
      isCurrentPasswordVisible,
      isNewPasswordVisible,
      fullName,
    } = this.state

    return (
      <ProfileWrapper>
        <Header>
          <Title>{ userFullName || userName }</Title>
        </Header>
        <UserContentWrapper>
          <AvatarWrapper>
            <Tooltip title={`Upload your avatar`}>
              <AvatarLabel htmlFor="file">
                <UploadInput
                  type="file"
                  id="file"
                  name="file"
                  onChange={this.onAvatarUpload}
                  accept="image/x-png,image/gif,image/jpeg"
                />
                {this.renderAvatar()}
              </AvatarLabel>
            </Tooltip>
          </AvatarWrapper>
          <FormWrapper onSubmit={this.onFormSubmit}>
            <FormControlStyled variant="outlined">
              <InputLabel
                htmlFor="email"
                color={(noValideField === 'email') ? 'secondary' : 'primary'}
              >Email</InputLabel>
              <OutlinedInput
                id="email"
                type={'text'}
                value={email || ''}
                error={(noValideField === 'email') ? true : false}
                onChange={this.onEmailChange}
                labelWidth={40}
              />
            </FormControlStyled>
            <FormControlStyled variant="outlined">
              <InputLabel
                htmlFor="fullName"
              >Full Name</InputLabel>
              <OutlinedInput
                id="fullName"
                type={'text'}
                value={fullName || ''}
                onChange={this.onFullNameChange}
                labelWidth={80}
              />
            </FormControlStyled>
            <FieldNote>To change your password, fill in the fields below</FieldNote>
            <FormControlStyled variant="outlined">
              <InputLabel
                htmlFor="currentPassword"
                color={(noValideField === 'currentPassword') ? 'secondary' : 'primary'}
              >Current Password</InputLabel>
              <OutlinedInput
                id="currentPassword"
                type={isCurrentPasswordVisible ? 'text' : 'password'}
                value={currentPassword}
                onChange={this.onCurrentPasswordChange}
                error={(noValideField === 'currentPassword') ? true : false}
                labelWidth={130}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => this.onCurrentPasswordOpen(!isCurrentPasswordVisible)}
                      onMouseDown={() => this.onCurrentPasswordOpen(!isCurrentPasswordVisible)}
                      edge="end"
                    >
                      {isCurrentPasswordVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                } />
            </FormControlStyled>
            <FormControlStyled variant="outlined">
              <InputLabel
                htmlFor="newPassword"
                color={(noValideField === 'newPassword') ? 'secondary' : 'primary'}
              >New Password</InputLabel>
              <OutlinedInput
                id="newPassword"
                type={isNewPasswordVisible ? 'text' : 'password'}
                value={newPassword}
                onChange={this.onNewPasswordChange}
                error={(noValideField === 'newPassword') ? true : false}
                labelWidth={110}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => this.onNewPasswordOpen(!isNewPasswordVisible)}
                      onMouseDown={() => this.onNewPasswordOpen(!isNewPasswordVisible)}
                      edge="end"
                    >
                      {isNewPasswordVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                } />
            </FormControlStyled>
            <Button variant="contained" color="primary" onClick={this.onFormSubmit}>Save</Button>
            {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
          </FormWrapper>
        </UserContentWrapper>
      </ProfileWrapper>
    )
  }
}

type StateProps = Pick<Props,
  | 'userName'
  | 'userFullName'
  | 'userEmail'
  | 'avatarUploadLink'
  | 'userId'
  | 'profileErrorMessage'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state), 
  userFullName: selectors.profile.userFullName(state),
  userEmail: selectors.profile.userEmail(state),
  avatarUploadLink: state.profile.avatarUploadLink,
  userId: selectors.profile.userId(state),
  profileErrorMessage: selectors.profile.profileErrorMessage(state),
})

type DispatchProps = Pick<Props, 'onGetUploadLink' | 'onSetAvatar' | 'onEditProfile' | 'onGetProfile'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetUploadLink: (value: ApiTypes.UploadLinkRequest) => dispatch(Actions.profile.getUploadLinkRequest(value)),
  onSetAvatar: (data: ApiTypes.Profile.Avatar) => dispatch(Actions.profile.setAvatarRequest(data)),
  onEditProfile: (data: ApiTypes.Profile.EditProfile) => dispatch(Actions.profile.editProfileRequest(data)),
  onGetProfile: () => dispatch(Actions.profile.getProfileRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile)