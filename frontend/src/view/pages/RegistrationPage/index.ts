import { connect } from 'react-redux'
import { RegistrationForm, Props } from './RegistrationForm'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'

type StateProps = Pick<Props, 'registrationErrorMessage' | 'isRegisterSuccess' | 'isUserRegisteredResult' | 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    registrationErrorMessage: selectors.registration.registrationErrorMessage(state),
    isRegisterSuccess: selectors.registration.isRegisterSuccess(state),
    isUserRegisteredResult: selectors.registration.isUserRegisteredResult(state),
    isLogged: selectors.authorization.isLogged(state),
})

type DispatchProps = Pick<Props, 'onRegisterUser' | 'onResetRegistrationResult' | 'onLogin'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onRegisterUser: (data: ApiTypes.RegisterUser) => dispatch(Actions.registration.registerUserRequest(data)),
    onResetRegistrationResult: () => {dispatch(Actions.registration.resetRegistrationResult())},
    onLogin: (data: ApiTypes.Login) => dispatch(Actions.authorization.loginRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm)
