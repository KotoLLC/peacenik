import React, { ChangeEvent, FormEvent } from 'react'
import TopBar from '@view/shared/TopBar'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import {
  ContainerStyled,
  FormWrapper,
  FormControlStyled,
  ButtonStyled,
  TitleWrapper,
} from './styles'

type FieldsType = 'node-name' | 'description' | ''

interface State {
  isRequest: boolean
  noValideField: FieldsType
  errorMessage: string
  nodeName: string
  description: string
}

export class NodeCreate extends React.PureComponent<{}, State> {

  state = {
    isRequest: false,
    errorMessage: '',
    noValideField: '' as FieldsType,
    nodeName: '',
    description: '',
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

    if (!this.onValidate()) return

    this.setState({
      isRequest: true,
      errorMessage: '',
      noValideField: '',
    })
  }

  render() {
    const {
      isRequest,
      errorMessage,
      noValideField,
      nodeName,
      description,
    } = this.state

    return (
      <>
        <TopBar />
        <ContainerStyled maxWidth="sm">
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
              {isRequest ? <CircularProgress size={25} color={'inherit'} /> : 'Register Node'}
            </ButtonStyled>
            {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
          </FormWrapper>
        </ContainerStyled>
      </>
    )
  }
}