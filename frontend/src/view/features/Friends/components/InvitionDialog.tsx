import React, { ChangeEvent, FormEvent } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
import { connect } from 'react-redux'
import { StoreTypes, ApiTypes } from 'src/types'
import { validate } from '@services/validation'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import TelegramIcon from '@material-ui/icons/Telegram'
import { ModalDialog } from '@view/shared/ModalDialog'
import { CircularProgressWhite } from '@view/shared/styles'
import {
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
  TextFieldWrapper,
  TextFieldLabel,
  OutlinedInputStyled,
  DialogSubTitle,
} from '@view/shared/ModalDialog/styles'
import {
  GetEmailText,
  DialogIconWrapper,
  InvitationsLink,
} from './styles'

interface State {
  isRequestSend: boolean
  errorMessage: string
  email: string
}

interface Props {
  isInviteByEmailSuccess: boolean
  isInvitationsDialogOpen: boolean
  errorMessage: string

  onOpenInvitationsDialog: (value: boolean) => void
  onInviteByEmail: (data: ApiTypes.Friends.Request) => void
  onInviteByEmailResult: (value: boolean) => void
}

class InvitionDialog extends React.Component<Props, State> {

  state = {
    isRequestSend: false,
    errorMessage: '',
    email: '',
  }

  static getDerivedStateFromProps(newProps: Props) {
    if (newProps.errorMessage || newProps.isInviteByEmailSuccess) {
      return {
        isRequestSend: false,
      }
    }

    return null
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
        errorMessage: 'The field can\'t be empty',
      })
      return false
    }

    if (!validate.isUserNameValid(email)) {
      this.setState({
        errorMessage: 'Incorrect email or user name',
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
    }, () => {
      this.props.onInviteByEmail({
        friend: email
      })
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
      <DialogSubTitle>Invitation sent successfully</DialogSubTitle>
      <DialogIconWrapper>
        <TelegramIcon />
      </DialogIconWrapper>
      <InvitationsLink onClick={this.swithToFormScreen}>Send more invitations</InvitationsLink>
    </>
  )

  renderForm = () => {
    const {
      isRequestSend,
      errorMessage,
      email,
    } = this.state

    const { onOpenInvitationsDialog } = this.props

    return (
      <>
        <DialogSubTitle>Send a friend request</DialogSubTitle>
        <GetEmailText>They will get an email shortly</GetEmailText>
        <form onSubmit={this.onFormSubmit}>
          <TextFieldWrapper>
            <TextFieldLabel>Enter email address or username</TextFieldLabel>
            <OutlinedInputStyled
              id="email"
              type={'text'}
              value={email}
              error={(errorMessage) ? true : false}
              onChange={this.onEmailChange}
            />
            {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
          </TextFieldWrapper>
          <ModalButtonsGroup>
            <ModalCancelButton
              className="grey"
              onClick={() => onOpenInvitationsDialog(false)}>
              Cancel
          </ModalCancelButton>
            <ModalAllowButton 
              type="submit" 
              disabled={isRequestSend}
              onClick={this.onFormSubmit}
            >
              {isRequestSend ? <CircularProgressWhite size={20} /> : 'Send'}
            </ModalAllowButton>
          </ModalButtonsGroup>
          
        </form>
      </>
    )
  }

  render() {
    const {
      isInviteByEmailSuccess,
      isInvitationsDialogOpen,
      onOpenInvitationsDialog,
    } = this.props

    return (
      <ModalDialog
        title="Invite friends"
        isModalOpen={isInvitationsDialogOpen}
        setOpenModal={() => onOpenInvitationsDialog(!isInvitationsDialogOpen)}
      >
        {isInviteByEmailSuccess ? this.renderSuccessfulyMessage() : this.renderForm()}
      </ModalDialog>
    )
  }
}

type StateProps = Pick<Props, 'isInviteByEmailSuccess' | 'isInvitationsDialogOpen' | 'errorMessage'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: selectors.common.errorMessage(state),
  isInviteByEmailSuccess: selectors.friends.isInviteByEmailSuccess(state),
  isInvitationsDialogOpen: selectors.friends.isInvitationsDialogOpen(state),
})

type DispatchProps = Pick<Props, 'onInviteByEmail' | 'onInviteByEmailResult' | 'onOpenInvitationsDialog'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onInviteByEmail: (data: ApiTypes.Friends.Request) => dispatch(Actions.friends.inviteByEmailRequest(data)),
  onInviteByEmailResult: (value: boolean) => dispatch(Actions.friends.inviteByEmailSuccess(value)),
  onOpenInvitationsDialog: (value: boolean) => dispatch(Actions.friends.openInvitationsDialog(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InvitionDialog)
