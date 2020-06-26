import { connect } from 'react-redux'
import { LoginForm, Props } from './LoginForm'
import Actions from '@store/actions'
import { ApiDataTypes, StoreTypes } from './../../../types'

type StateProps = Pick<Props, 'loginErrorMessage' | 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    loginErrorMessage: state.authorization.loginErrorMessage,
    isLogged: state.authorization.isLogged,
})

type DispatchProps = Pick<Props, 'onLogin'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onLogin: (data: ApiDataTypes.Login) => dispatch(Actions.authorization.loginRequested(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
