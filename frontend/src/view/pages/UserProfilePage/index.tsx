import React, { ChangeEvent, FormEvent } from 'react'
import { WithTopBar } from '@view/shared/WithTopBar'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import { StoreTypes } from './../../../types'
import PersonIcon from '@material-ui/icons/Person'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { validate } from '@services/validation'
import FormHelperText from '@material-ui/core/FormHelperText'
// import Actions from '@store/actions'
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
}

interface State {
  email: string,
  isRequestSend: boolean,
  errorMessage: string,
}

class UserProfile extends React.PureComponent<Props, State> {

  state = {
    email: this.props.userEmail || '',
    isRequestSend: false,
    errorMessage: '',
    file: null,
    // file: this.props.userAvatar || ''
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
    const file = event.target.files 
    if (file && file[0]) {
      // console.log(file[0])
    }
  }

  render() {
    const { userName } = this.props
    const { errorMessage, email } = this.state

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
                    <PersonIcon fontSize="large" color="action" />
                    <UploadInput
                      type="file"
                      id="file"
                      name="file"
                      onChange={this.onAvatarUpload}
                      accept="image/x-png,image/gif,image/jpeg"
                    />
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

type StateProps = Pick<Props, 'userName' | 'userEmail'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userName: selectors.profile.userName(state),
  userEmail: selectors.profile.userEmail(state),
})

// type DispatchProps = Pick<Props, ''>
// const mapDispatchToProps = (dispatch): DispatchProps => ({
// })

export default connect(mapStateToProps)(UserProfile)