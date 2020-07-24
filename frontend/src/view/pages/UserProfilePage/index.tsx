import React, { ChangeEvent, FormEvent } from 'react'
import { WithTopBar } from '@view/shared/WithTopBar'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes, ApiTypes } from './../../../types'
import PersonIcon from '@material-ui/icons/Person'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { validate } from '@services/validation'
import FormHelperText from '@material-ui/core/FormHelperText'
import Actions from '@store/actions'
import {
  ContainerStyled,
  ProfileWrapper,
  Header,
  Title,
  ContentWrapper,
  AvatarWrapper,
  FormWrapper,
  Avatart,
  UserNameWrapper,
  FormControlStyled,
  UploadInput,
} from './styles'

interface Props {
  userName: string
  userEmail: string
  uploadLink: ApiTypes.UploadLink | null
  onGetUploadLink: (value: string) => void
  onSetAvatar: (data: ApiTypes.Avatar) => void
}

interface State {
  email: string,
  isRequestSend: boolean,
  errorMessage: string,
  isFileUploaded: boolean
  file: File | null
}

class UserProfile extends React.PureComponent<Props, State> {

  state = {
    email: this.props.userEmail || '',
    isRequestSend: false,
    errorMessage: '',
    isFileUploaded: false,
    file: null,
  }

  onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: event.currentTarget.value.trim(),
    })
  }

  onValidate = (): boolean => {
    const { email } = this.state

    if (!email) {
      this.setState({
        errorMessage: 'The email can\'t be empty',
      })
      return false
    }

    if (!validate.isEmailValid(email)) {
      this.setState({
        errorMessage: 'Incorrect email',
      })
      return false
    }

    return true
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    const { email } = this.state
    if (!this.onValidate()) return

    this.setState({
      isRequestSend: true,
      errorMessage: '',
    })
  }

  onAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetUploadLink } = this.props

    this.setState({
      isFileUploaded: false,
    })

    const file = event.target.files
    if (file && file[0]) {
      onGetUploadLink(file[0].type)
      this.setState({
        file: file[0],
      })
    }
  }

  static getDerivedStateFromProps(newProps: Props, prevState: State) {

    if (newProps?.uploadLink && prevState?.file && !prevState.isFileUploaded) {

      const { form_data } = newProps?.uploadLink
      const data = new FormData()

      data.append('file', prevState?.file, prevState?.file.name)

      for (let key in form_data) {
        data.append(key, form_data[key])
      }
      
      newProps.onSetAvatar({
        link: newProps?.uploadLink.link,
        form_data: data,
      })

      return {
        isFileUploaded: true
      }
    }
    return null
  }

  render() {
    const { userName } = this.props
    const { errorMessage, email, file } = this.state

    return (
      <WithTopBar>
        <ContainerStyled>
          <ProfileWrapper>
            <Header>
              <Title>Profile</Title>
            </Header>
            <ContentWrapper>
              <AvatarWrapper>
                <Tooltip title={`Upload your avatar`}>
                  <Avatart htmlFor="file">
                    <UploadInput
                      type="file"
                      id="file"
                      name="file"
                      onChange={this.onAvatarUpload}
                      accept="image/x-png,image/gif,image/jpeg"
                    />
                    {file ? <img src={URL.createObjectURL(file)} alt=""/> : <PersonIcon fontSize="large" color="action" />}
                  </Avatart>
                </Tooltip>
              </AvatarWrapper>
              <FormWrapper onSubmit={this.onFormSubmit}>
                <UserNameWrapper>
                  Name: {userName}
                </UserNameWrapper>
                <FormControlStyled variant="outlined">
                  <InputLabel
                    htmlFor="email"
                    color={(errorMessage) ? 'secondary' : 'primary'}
                  >Email</InputLabel>
                  <OutlinedInput
                    id="email"
                    type={'text'}
                    value={email}
                    error={(errorMessage) ? true : false}
                    onChange={this.onEmailChange}
                    labelWidth={40}
                  />
                </FormControlStyled>
                <Button variant="contained" color="primary" onClick={this.onFormSubmit}>Save</Button>
                {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
              </FormWrapper>
            </ContentWrapper>
          </ProfileWrapper>
        </ContainerStyled>
      </WithTopBar>
    )
  }
}

type StateProps = Pick<Props, 'userName' | 'userEmail' | 'uploadLink'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state),
  userEmail: selectors.profile.userEmail(state),
  uploadLink: state.profile.uploadLink,
})

type DispatchProps = Pick<Props, 'onGetUploadLink' | 'onSetAvatar'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetUploadLink: (value: string) => dispatch(Actions.profile.getUploadLinkRequest(value)),
  onSetAvatar: (data: ApiTypes.Avatar) => dispatch(Actions.profile.setAvatarRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)