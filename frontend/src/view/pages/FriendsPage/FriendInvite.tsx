import React, { ChangeEvent, FormEvent } from 'react'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import { connect } from 'react-redux'
import { StoreTypes } from '../../../types'
import { validate } from '@services/validation'
import Link from '@material-ui/core/Link'
// import selectors from '@selectors/index'
// import Actions from '@store/actions'
import {
  ContainerStyled,
  FormWrapper,
  FormControlStyled,
  ButtonStyled,
  TitleWrapper,
  LinkWrapper,
} from './styles'

interface State {
  isRequested: boolean
  isSended: boolean
  errorMessage: string
  email: string
}

interface Props {
  isInviteSuccessfully: boolean
}

class FriendInvite extends React.PureComponent<Props, State> {

  state = {
    isRequested: false,
    isSended: false,
    errorMessage: '',
    email: '',
  }

  // static getDerivedStateFromProps(newProps: Props) {
  //   return {
  //     isRequested: newProps.isInviteSuccessfully ? false : false,
  //     isSended: newProps.isInviteSuccessfully,
  //   }
  // }

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

    this.setState({
      isRequested: true,
      isSended: true,
      errorMessage: '',
    })
  }

  swithToFormScreen = () => {
    this.setState({
      isSended: false,
      isRequested: false,
      email: '',
    })
  }

  componentWillUnmount() {
    // this.props.onNodeCreationStatusReset()
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
      isRequested,
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
            {isRequested ? <CircularProgress size={25} color={'inherit'} /> : 'Send invitation'}
          </ButtonStyled>
          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormWrapper>
      </>
    )
  }

  render() {
    const { isSended } = this.state

    return (
      <ContainerStyled maxWidth="sm">
        {isSended ? this.renderSuccessfulyMessage() : this.renderForm()}
      </ContainerStyled>
    )
  }
}

type StateProps = Pick<Props, 'isInviteSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isInviteSuccessfully: false
})

// type DispatchProps = Pick<Props, ''>
// const mapDispatchToProps = (dispatch): DispatchProps => ({
// })

export default connect(mapStateToProps, null)(FriendInvite)