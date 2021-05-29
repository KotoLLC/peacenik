import React, { ChangeEvent, FormEvent } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes, CommonTypes } from 'src/types'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  HubSettingsBlock,
  HubOptionTitle,
  HubOptionText,
  HubFieldWrapper,
  HubFieldLabel,
  HubFieldInput,
  HubFieldNote,
  SelectStyled,
  SelectFieldWrapper,
} from './styles'
import {
  CheckboxLabel,
  ButtonContained,
  ErrorMessage,
} from '@view/shared/styles'

type FieldsType = 'hub-name' | 'description' | ''

interface State {
  isRequested: boolean
  noValideField: FieldsType
  errorMessage: string
  hubName: string
  postLimit: number
}

interface Props {
  isHubCreatedSuccessfully: boolean
  hubCreationStatus: CommonTypes.HubTypes.CreationStatus
  isAdmin: boolean | undefined
  onHubCreate: (data: ApiTypes.Hubs.Create) => void
  onHubCreationStatusReset: () => void
}

class HubOptionB extends React.PureComponent<Props, State> {

  inputRef = React.createRef<HTMLInputElement>()

  state = {
    isRequested: false,
    errorMessage: '',
    noValideField: '' as FieldsType,
    hubName: '',
    postLimit: 2,
  }

  static getDerivedStateFromProps(newProps: Props) {
    return {
      isRequested: newProps.isHubCreatedSuccessfully ? false : false
    }
  }

  onHubNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      hubName: event.currentTarget.value.trim()
    })
  }

  onPostLimitChange = (event) => {
    this.setState({
      postLimit: event.target.value
    })
  }

  onValidate = (): boolean => {
    const { hubName } = this.state

    if (!hubName?.length) {
      this.setState({
        errorMessage: 'Enter your Domain',
        noValideField: 'hub-name',
      })
      return false
    }

    return true
  }

  onCopy = () => {
    this.inputRef?.current?.focus()
    this.inputRef?.current?.select()
    this.inputRef?.current?.setSelectionRange(0, 99999)
    document.execCommand('copy')
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    const { hubName, postLimit } = this.state
    const { onHubCreate } = this.props

    if (!this.onValidate()) return

    this.setState({
      isRequested: true,
      errorMessage: '',
      noValideField: '',
    })

    onHubCreate({
      address: hubName,
      post_limit: postLimit,
      details: '',
    })
  }

  componentWillUnmount() {
    this.props.onHubCreationStatusReset()
  }

  renderSuccessfulyMessage = () => (
    <HubOptionText>Your request for the new hub sent. Please wait for a response.</HubOptionText>
  )

  renderForm = () => {
    const {
      isRequested,
      errorMessage,
      noValideField,
      hubName,
      postLimit,
    } = this.state

    const { isAdmin } = this.props

    return (
      <>
        <HubFieldWrapper>
          <HubFieldLabel>
            1. Run the installer on Ubuntu (18.04+)
          </HubFieldLabel>
          <HubFieldInput
            value="wget -c https://fra1.digitaloceanspaces.com/peacenik/message-hub-installer.tar.gz -O - | tar -xz && ./message-hub-installer"
            ref={this.inputRef}
            onChange={() => {/**/ }}
          />
          <ButtonContained onClick={this.onCopy}>Copy</ButtonContained>
        </HubFieldWrapper>
        <HubFieldWrapper>
          <HubFieldLabel>
            2. Configure DNS and enter a domain name
          </HubFieldLabel>
          <HubFieldInput
            id="hub-name"
            type={'text'}
            value={hubName}
            className={noValideField === 'hub-name' ? 'error' : ''}
            onChange={this.onHubNameChange}
          />
        </HubFieldWrapper>
        <HubFieldWrapper>
          <HubFieldLabel>
            3. Activate your hub
          </HubFieldLabel>
          <HubFieldNote>
            <b>Important:</b> violations of the Peacenik code of conduct may result in deactivation of your hub.
          </HubFieldNote>
          <SelectFieldWrapper>
            <CheckboxLabel
              className="general"
              control={
                <Checkbox
                  // checked={false}
                  // onChange={(event) => this.onHideIdentityChange(event.target.checked)}
                  name="acceptRules"
                  color="primary"
                />
              }
              label="I understand"
            />
            <SelectStyled
              variant="outlined"
              labelId="post-limit"
              id="post-limit"
              value={postLimit}
              onChange={value => this.onPostLimitChange(value)}
            >
              {isAdmin && <MenuItem value={0}>Unlimited posts</MenuItem>}
              <MenuItem value={1}>Only admin can post</MenuItem>
              <MenuItem value={2}>Only admin's friends can post</MenuItem>
              <MenuItem value={3}>Admin's 2nd level of friends can post</MenuItem>
            </SelectStyled>
            <ButtonContained
              onClick={this.onFormSubmit}
              disabled={isRequested}
            >
              {isRequested ? <CircularProgress size={20} color={'inherit'} /> : 'Activate'}
            </ButtonContained>
          </SelectFieldWrapper>
        </HubFieldWrapper>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </>
    )
  }

  render() {
    const { isHubCreatedSuccessfully, hubCreationStatus } = this.props
    return (
      <HubSettingsBlock>
        {(isHubCreatedSuccessfully || ((isHubCreatedSuccessfully !== false) && (hubCreationStatus !== ''))) ? this.renderSuccessfulyMessage() : this.renderForm()}
      </HubSettingsBlock>
    )
  }
}

type StateProps = Pick<Props, 'isHubCreatedSuccessfully' | 'isAdmin'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isHubCreatedSuccessfully: selectors.hubs.isHubCreatedSuccessfully(state),
  isAdmin: selectors.profile.isAdmin(state),
})

type DispatchProps = Pick<Props, 'onHubCreate' | 'onHubCreationStatusReset'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onHubCreate: (data: ApiTypes.Hubs.Create) => dispatch(Actions.hubs.hubCreateRequest(data)),
  onHubCreationStatusReset: () => dispatch(Actions.hubs.hubCreationStatusReset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HubOptionB)
