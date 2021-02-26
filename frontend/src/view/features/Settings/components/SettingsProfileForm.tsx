import React, { ChangeEvent, FormEvent } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from 'src/types'
import CoverIcon from '@assets/images/groups-cover-icon.svg'
import CircularProgress from '@material-ui/core/CircularProgress'
import PersonIcon from '@material-ui/icons/Person'
import FaceIcon from '@material-ui/icons/Face'
import MailIcon from '@material-ui/icons/Mail'
import Checkbox from '@material-ui/core/Checkbox'
import { getAvatarUrl } from '@services/avatarUrl'
import { validate } from '@services/validation'
import loadImage from 'blueimp-load-image'
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
} from './styles'

interface Props {
  userName: string
  userFullName: string
  userEmail: string
  userId: string
  uploadLink: ApiTypes.UploadLink | null
  profileErrorMessage: string

  onGetUploadLink: (value: ApiTypes.Profile.UploadLinkRequest) => void
  onSetAvatar: (data: ApiTypes.Profile.Avatar) => void
  onEditProfile: (data: ApiTypes.Profile.EditProfile) => void
  onGetProfile: () => void
}

type FieldsType = 'email' | ''

interface State {
  email: string | null
  isRequestSend: boolean
  errorMessage: string
  isFileUploaded: boolean
  file: File | null
  fullName: string
  noValideField: FieldsType
  isCurrentPasswordVisible: boolean
  isNewPasswordVisible: boolean
}

class SettingsProfileForm extends React.PureComponent<Props, State> {

  state = {
    email: null,
    isRequestSend: false,
    errorMessage: '',
    isFileUploaded: false,
    file: null,
    fullName: this.props?.userFullName || '',
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

  onValidate = (): boolean => {
    const { email } = this.state

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

    return true
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()

    const { email, fullName } = this.state
    const { uploadLink, userEmail, onEditProfile, userFullName } = this.props

    if (!this.onValidate()) return

    let avatarData = {}
    let emailData = {}
    let fullNameData = {}

    if (uploadLink?.blob_id) {
      avatarData = {
        avatar_changed: true,
        avatar_id: uploadLink.blob_id
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

    const data = { ...emailData, ...avatarData, ...fullNameData }
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

    if (newProps?.uploadLink && prevState?.file) {

      const { form_data } = newProps?.uploadLink
      const data = new FormData()

      for (let key in form_data) {
        data.append(key, form_data[key])
      }

      data.append('file', prevState?.file, prevState?.file.name)

      newProps.onSetAvatar({
        link: newProps?.uploadLink.link,
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
      return <EditsAvatar src={URL.createObjectURL(file)} alt={userName} />
    }

    return <EditsAvatar src={getAvatarUrl(userId)} alt={userName} />
  }

  componentDidMount() {
    this.props.onGetProfile()
  }

  render() {
    const { userName } = this.props

    const {
      errorMessage,
      email,
      noValideField,
      fullName,
      isRequestSend,
    } = this.state

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
              accept="image/*"
            />
          </label>
        </EditCoverWrapper>
        <EditsAvatarWrapper>
          <label htmlFor="file">
            {this.renderAvatar()}
            <UploadInput
              type="file"
              id="file"
              name="file"
              onChange={this.onAvatarUpload}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </EditsAvatarWrapper>
        <SettingsFormWrapper onSubmit={this.onFormSubmit}>
          <SettingsFieldWrapper>
            <SettingsFieldPlaceholder>Full name</SettingsFieldPlaceholder>
            <TextFieldStyled
              variant="outlined"
              id="fullName"
              value={fullName || ''}
              onChange={this.onFullNameChange}
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
              value={`@${userName}`}
              disabled
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
              id="email"
              type={'text'}
              value={email || ''}
              error={(noValideField === 'email') ? true : false}
              onChange={this.onEmailChange}
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
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <EditButtonsWrapper>
            <ButtonContainedStyled disabled={isRequestSend} onClick={this.onFormSubmit}>
              {isRequestSend ? <CircularProgress size={20} color={'inherit'} /> : 'Save changes'}
            </ButtonContainedStyled>
          </EditButtonsWrapper>
        </SettingsFormWrapper>
      </>
    )
  }
}

type StateProps = Pick<Props,
  | 'userName'
  | 'userFullName'
  | 'userEmail'
  | 'uploadLink'
  | 'userId'
  | 'profileErrorMessage'
>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state),
  userFullName: selectors.profile.userFullName(state),
  userEmail: selectors.profile.userEmail(state),
  uploadLink: state.profile.uploadLink,
  userId: selectors.profile.userId(state),
  profileErrorMessage: selectors.profile.profileErrorMessage(state),
})

type DispatchProps = Pick<Props, 'onGetUploadLink' | 'onSetAvatar' | 'onEditProfile' | 'onGetProfile'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetUploadLink: (value: ApiTypes.Profile.UploadLinkRequest) => dispatch(Actions.profile.getUploadLinkRequest(value)),
  onSetAvatar: (data: ApiTypes.Profile.Avatar) => dispatch(Actions.profile.setAvatarRequest(data)),
  onEditProfile: (data: ApiTypes.Profile.EditProfile) => dispatch(Actions.profile.editProfileRequest(data)),
  onGetProfile: () => dispatch(Actions.profile.getProfileRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsProfileForm)