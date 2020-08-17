import React, { ChangeEvent, FormEvent } from 'react'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from 'src/types'

import {
  ContainerStyled,
  FormWrapper,
  FormControlStyled,
  ButtonStyled,
  TitleWrapper,
  LinkWrapper,
  LinkStyled,
} from './styles'

type FieldsType = 'hub-name' | 'description' | ''

interface State {
  isRequested: boolean
  noValideField: FieldsType
  errorMessage: string
  hubName: string
  description: string
}

interface Props {
  isHubCreatedSuccessfully: boolean
  onHubCreate: (data: ApiTypes.MessageHubs.Create) => void
  onHubCreationStatusReset: () => void
}

class MessageHubCreation extends React.PureComponent<Props, State> {

  state = {
    isRequested: false,
    errorMessage: '',
    noValideField: '' as FieldsType,
    hubName: '',
    description: '',
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

  onDescriptionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      description: event.currentTarget.value
    })
  }

  onValidate = (): boolean => {
    const { hubName, description } = this.state

    if (!hubName?.length) {
      this.setState({
        errorMessage: 'Enter your Domain',
        noValideField: 'hub-name',
      })
      return false
    }

    if (!description?.length) {
      this.setState({
        errorMessage: 'Enter your hub description',
        noValideField: 'description',
      })
      return false
    }

    return true
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    const { hubName, description } = this.state
    const { onHubCreate } = this.props

    if (!this.onValidate()) return

    this.setState({
      isRequested: true,
      errorMessage: '',
      noValideField: '',
    })

    onHubCreate({
      address: hubName,
      details: description,
    })
  }

  componentWillUnmount() {
    this.props.onHubCreationStatusReset()
  }

  renderSuccessfulyMessage = () => (
    <Typography variant="h5" align="center">Your request for the new Hub sended successfuly, await for response.</Typography>
  )

  renderForm = () => {
    const {
      isRequested,
      errorMessage,
      noValideField,
      hubName,
      description,
    } = this.state

    return (
      <>
        <TitleWrapper>
          <Typography variant="h4" gutterBottom>Register a message hub</Typography>
          <Typography variant="subtitle1" gutterBottom>
            Message hubs store messages, photos, and videos for a group of friends. To learn how
            message hubs work, visit the help docs at https://docs.koto.at
          </Typography>
        </TitleWrapper>
        <FormWrapper onSubmit={this.onFormSubmit}>
          <FormControlStyled variant="outlined">
            <InputLabel 
              htmlFor="name" 
              color={(noValideField === 'hub-name') ? 'secondary' : 'primary'}>Domain or IP address</InputLabel>
            <OutlinedInput
              id="hub-name"
              type={'text'}
              value={hubName}
              error={noValideField === 'hub-name'}
              onChange={this.onHubNameChange}
              labelWidth={155}
            />
          </FormControlStyled>
          <FormControlStyled variant="outlined">
            <OutlinedInput
              id="description"
              type={'text'}
              value={description}
              error={noValideField === 'description'}
              placeholder={'Please tell us how you will enforce our code of conduct (100 word maximum)'}
              multiline
              rows={8}
              onChange={this.onDescriptionChange}
            />
          </FormControlStyled>
          <ButtonStyled
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            onClick={this.onFormSubmit}
          >
            {isRequested ? <CircularProgress size={25} color={'inherit'} /> : 'Register Hub'}
          </ButtonStyled>
          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormWrapper>
        <LinkWrapper>
          <LinkStyled to="/docs/code-of-conduct">Code of conduct</LinkStyled>
        </LinkWrapper>
      </>
    )
  }

  render() {
    const { isHubCreatedSuccessfully } = this.props

    return (
      <ContainerStyled maxWidth="sm">
        {isHubCreatedSuccessfully ? this.renderSuccessfulyMessage() : this.renderForm()}
      </ContainerStyled>
    )
  }
}

type StateProps = Pick<Props, 'isHubCreatedSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isHubCreatedSuccessfully: selectors.messageHubs.isHubCreatedSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onHubCreate' | 'onHubCreationStatusReset'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onHubCreate: (data: ApiTypes.MessageHubs.Create) => dispatch(Actions.messageHubs.hubCreateRequest(data)),
  onHubCreationStatusReset: () => dispatch(Actions.messageHubs.hubCreationStatusReset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageHubCreation)