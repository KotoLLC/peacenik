import { connect } from 'react-redux'
import { LoginForm, Props } from './LoginForm'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from './../../../types'

type StateProps = Pick<Props, 'loginErrorMessage' | 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    loginErrorMessage: state.authorization.loginErrorMessage,
    isLogged: state.authorization.isLogged,
})

type DispatchProps = Pick<Props, 'onLogin' | 'resetLoginFailedMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onLogin: (data: ApiTypes.Login) => dispatch(Actions.authorization.loginRequested(data)),
    resetLoginFailedMessage: () => dispatch(Actions.authorization.resetLoginFailedMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
