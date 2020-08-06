import { connect } from 'react-redux'
import { LoginForm, Props } from './LoginForm'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'

type StateProps = Pick<Props, 'loginErrorMessage' | 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    loginErrorMessage: selectors.authorization.loginErrorMessage(state),
    isLogged: selectors.authorization.isLogged(state),
})

type DispatchProps = Pick<Props, 'onLogin' | 'resetLoginFailedMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onLogin: (data: ApiTypes.Login) => dispatch(Actions.authorization.loginRequest(data)),
    resetLoginFailedMessage: () => dispatch(Actions.authorization.resetLoginFailedMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
