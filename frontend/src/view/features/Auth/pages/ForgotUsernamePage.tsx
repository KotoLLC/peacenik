import React, { FormEvent, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'
import { validate } from '@services/validation'
import { RouteComponentProps } from 'react-router-dom'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import CloseIcon from '@material-ui/icons/Close'
import {
  AuthForm,
  FormSubtitle,
  SubmitButton,
  TextFieldStyled,
  CloseButton,
} from '../components/styles'

type FieldsType = 'email' | ''

export interface Props extends RouteComponentProps {
  isForgotUserNameSent: boolean

  onUserNameRequest: (data: ApiTypes.ForgotUserName) => void
}

const ForgotUsernamePage = (props) => {
  const [email, onEmailChange] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [noValideField, setNoValideField] = useState<FieldsType>('')
  const [isRequest, setRequest] = useState<boolean>(false)

  const { onUserNameRequest, isForgotUserNameSent, history } = props

  const onValidate = (): boolean => {

    if (!validate.isEmailValid(email)) {
      setErrorMessage('Email is incorrect')
      setNoValideField('email')
      return false
    }

    return true
  }

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!onValidate()) return

    setRequest(true)
    setErrorMessage('')
    setNoValideField('')
    onUserNameRequest({ email })
  }

  useEffect(() => {
    setRequest(isForgotUserNameSent)
  }, [
    onUserNameRequest,
    isForgotUserNameSent,
  ])

  return (
    <>
      <AuthForm onSubmit={onFormSubmit}>
        <CloseButton onClick={() => history.push('/login')}>
          <CloseIcon />
        </CloseButton>
        <FormSubtitle>To send a reminder request to username, please fill in the following field.</FormSubtitle>
        <TextFieldStyled
          id="email"
          variant="outlined"
          placeholder="Email"
          type="text"
          value={email}
          error={(noValideField === 'email') ? true : false}
          onChange={(event) => onEmailChange(event.currentTarget.value.trim())}
        />
        <SubmitButton
          type="submit"
          onClick={onFormSubmit}
          className="green"
        >{isRequest ? <CircularProgress size={20} color={'inherit'} /> : 'Send'}</SubmitButton>
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </AuthForm>
    </>
  )
}

type StateProps = Pick<Props, 'isForgotUserNameSent'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    isForgotUserNameSent: selectors.authorization.isForgotUserNameSent(state),
})

type DispatchProps = Pick<Props, 'onUserNameRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onUserNameRequest: (data: ApiTypes.ForgotUserName) => dispatch(Actions.authorization.forgotUserNameRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotUsernamePage)