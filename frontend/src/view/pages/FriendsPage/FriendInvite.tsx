import React, { ChangeEvent, FormEvent } from 'react'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import { connect } from 'react-redux'
import { StoreTypes, ApiTypes } from 'src/types'
import { validate } from '@services/validation'
import Link from '@material-ui/core/Link'
import selectors from '@selectors/index'
import Actions from '@store/actions'

import {
  ContainerStyled,
  FormWrapper,
  FormControlStyled,
  ButtonStyled,
  TitleWrapper,
  LinkWrapper,
} from './styles'

interface State {
  isRequestSend: boolean
  errorMessage: string
  email: string
}

interface Props {
  isInviteByEmailSuccess: boolean
  onInviteByEmail: (data: ApiTypes.Friends.Request) => void
  onInviteByEmailResult: (value: boolean) => void
}

class FriendInvite extends React.PureComponent<Props, State> {

  state = {
    isRequestSend: false,
    errorMessage: '',
    email: '',
  }

  static getDerivedStateFromProps() {
    return {
      isRequestSend: false,
    }
  }

  onEmailChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    this.props.onInviteByEmail({
      friend: email
    })

    this.setState({
      isRequestSend: true,
      errorMessage: '',
    })
  }

  swithToFormScreen = () => {
    this.props.onInviteByEmailResult(false)
    this.setState({
      isRequestSend: false,
      email: '',
    })
  }

  componentWillUnmount() {
    this.props.onInviteByEmailResult(false)
  }

  renderSuccessfulyMessage = () => (
    <>
      <Typography variant="h5" align="center">Invitation sent successfully</Typography>
      <LinkWrapper>
        <Link
          component="button"
          variant="body1"
          onClick={this.swithToFormScreen}
        >Send more invitation</Link>
      </LinkWrapper>
    </>
  )

  renderForm = () => {
    const {
      isRequestSend,
      errorMessage,
      email,
    } = this.state

    return (
      <>
        <TitleWrapper>
          <Typography variant="h4" gutterBottom>Invite Your Friend</Typography>
          <Typography variant="subtitle1" gutterBottom>Your friend will receive the invitation by email.</Typography>
        </TitleWrapper>
        <FormWrapper onSubmit={this.onFormSubmit}>
          <FormControlStyled variant="outlined">
            <InputLabel
              htmlFor="email"
              color={(errorMessage) ? 'secondary' : 'primary'}
            >Enter email address</InputLabel>
            <OutlinedInput
              id="email"
              type={'text'}
              value={email}
              error={(errorMessage) ? true : false}
              onChange={this.onEmailChange}
              labelWidth={145}
            />
          </FormControlStyled>
          <ButtonStyled
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            onClick={this.onFormSubmit}
          >
            {isRequestSend ? <CircularProgress size={25} color={'inherit'} /> : 'Send invitation'}
          </ButtonStyled>
          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormWrapper>
      </>
    )
  }

  render() {
    const { isInviteByEmailSuccess } = this.props

    return (
      <ContainerStyled maxWidth="sm">
        {isInviteByEmailSuccess ? this.renderSuccessfulyMessage() : this.renderForm()}
      </ContainerStyled>
    )
  }
}

type StateProps = Pick<Props, 'isInviteByEmailSuccess'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isInviteByEmailSuccess: selectors.friends.isInviteByEmailSuccess(state),
})

type DispatchProps = Pick<Props, 'onInviteByEmail' | 'onInviteByEmailResult'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onInviteByEmail: (data: ApiTypes.Friends.Request) => dispatch(Actions.friends.inviteByEmailRequest(data)),
  onInviteByEmailResult: (value: boolean) => dispatch(Actions.friends.inviteByEmailSuccess(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FriendInvite)