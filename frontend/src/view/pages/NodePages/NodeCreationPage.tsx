import React, { ChangeEvent, FormEvent } from 'react'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from '../../../types'

import {
  ContainerStyled,
  FormWrapper,
  FormControlStyled,
  ButtonStyled,
  TitleWrapper,
} from './styles'

type FieldsType = 'node-name' | 'description' | ''

interface State {
  isRequested: boolean
  noValideField: FieldsType
  errorMessage: string
  nodeName: string
  description: string
}

interface Props {
  isNodeCreatedSuccessfully: boolean
  onNodeCreate: (data: ApiTypes.Nodes.Create) => void
  onNodeCreationStatusReset: () => void
}

class NodeCreation extends React.PureComponent<Props, State> {

  state = {
    isRequested: false,
    errorMessage: '',
    noValideField: '' as FieldsType,
    nodeName: '',
    description: '',
  }

  static getDerivedStateFromProps(newProps: Props) {
    return {
      isRequested: newProps.isNodeCreatedSuccessfully ? false : false
    }
  }

  onNodeNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      nodeName: event.currentTarget.value.trim()
    })
  }

  onDescriptionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState({
      description: event.currentTarget.value.trim()
    })
  }

  onValidate = (): boolean => {
    const { nodeName, description } = this.state

    if (!nodeName.length) {
      this.setState({
        errorMessage: 'Enter your Domain',
        noValideField: 'node-name',
      })
      return false
    }

    if (!description.length) {
      this.setState({
        errorMessage: 'Enter your node description',
        noValideField: 'description',
      })
      return false
    }

    return true
  }

  onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    const { nodeName, description } = this.state
    const { onNodeCreate } = this.props

    if (!this.onValidate()) return

    this.setState({
      isRequested: true,
      errorMessage: '',
      noValideField: '',
    })

    onNodeCreate({
      address: nodeName,
      details: description,
    })
  }

  componentWillUnmount() {
    this.props.onNodeCreationStatusReset()
  }

  renderSuccessfulyMessage = () => (
    <Typography variant="h5" align="center">Your request for the new Node sended successfuly, await for response.</Typography>
  )

  renderForm = () => {
    const {
      isRequested,
      errorMessage,
      noValideField,
      nodeName,
      description,
    } = this.state

    return (
      <>
        <TitleWrapper>
          <Typography variant="h4" gutterBottom>Register new node</Typography>
          <Typography variant="subtitle1" gutterBottom>Some description here</Typography>
        </TitleWrapper>
        <FormWrapper onSubmit={this.onFormSubmit}>
          <FormControlStyled variant="outlined">
            <InputLabel htmlFor="name">Domain or IP address</InputLabel>
            <OutlinedInput
              id="node-name"
              type={'text'}
              value={nodeName}
              error={(noValideField === 'node-name') ? true : false}
              onChange={this.onNodeNameChange}
              labelWidth={155}
            />
          </FormControlStyled>
          <FormControlStyled variant="outlined">
            <InputLabel htmlFor="name">Pleas tell us about yourself</InputLabel>
            <OutlinedInput
              id="description"
              type={'text'}
              value={description}
              error={(noValideField === 'description') ? true : false}
              placeholder={''}
              labelWidth={195}
              multiline
              rows={5}
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
            {isRequested ? <CircularProgress size={25} color={'inherit'} /> : 'Register Node'}
          </ButtonStyled>
          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormWrapper>
      </>
    )
  }

  render() {
    const { isNodeCreatedSuccessfully } = this.props

    return (
      <ContainerStyled maxWidth="sm">
        {isNodeCreatedSuccessfully ? this.renderSuccessfulyMessage() : this.renderForm()}
      </ContainerStyled>
    )
  }
}

type StateProps = Pick<Props, 'isNodeCreatedSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isNodeCreatedSuccessfully: selectors.nodes.isNodeCreatedSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onNodeCreate' | 'onNodeCreationStatusReset'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onNodeCreate: (data: ApiTypes.Nodes.Create) => dispatch(Actions.nodes.nodeCreateRequest(data)),
  onNodeCreationStatusReset: () => dispatch(Actions.nodes.nodeCreationStatusReset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NodeCreation)