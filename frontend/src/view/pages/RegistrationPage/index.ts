import { connect } from 'react-redux'
import { RegistrationForm, Props } from './RegistrationForm'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'

type StateProps = Pick<Props, 'registrationErrorMessage' | 'isRegisterSuccess' | 'isUserRegisteredResult'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    registrationErrorMessage: selectors.registration.registrationErrorMessage(state),
    isRegisterSuccess: selectors.registration.isRegisterSuccess(state),
    isUserRegisteredResult: selectors.registration.isUserRegisteredResult(state),
})

type DispatchProps = Pick<Props, 'onRegisterUser' | 'onResetRegistrationResult' | 'onCheckIsUserRegistered' | 'onSetAuthToken'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onRegisterUser: (data: ApiTypes.RegisterUser) => dispatch(Actions.registration.registerUserRequest(data)),
    onResetRegistrationResult: () => {
        dispatch(Actions.registration.resetRegistrationResult())
        dispatch(Actions.registration.checkIsUserRegisteredResult(false))
    },
    onCheckIsUserRegistered: (data: ApiTypes.CheckUser) => dispatch(Actions.registration.checkIsUserRegisteredRequest(data)),
    onSetAuthToken: (value: string) => dispatch(Actions.authorization.getAuthTokenSucces(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm)
