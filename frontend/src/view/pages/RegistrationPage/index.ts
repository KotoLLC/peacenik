import { connect } from 'react-redux'
import { RegistrationForm, Props } from './RegistrationForm'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from '../../../types'
import selectors from '@selectors/index'

type StateProps = Pick<Props, 'registrationErrorMessage' | 'isRegisterSuccess'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    registrationErrorMessage: selectors.registration.registrationErrorMessage(state),
    isRegisterSuccess: selectors.registration.isRegisterSuccess(state),
})

type DispatchProps = Pick<Props, 'onRegisterUser' | 'onResetRegistrationResult'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onRegisterUser: (data: ApiTypes.RegisterUser) => dispatch(Actions.registration.registerUserRequest(data)),
    onResetRegistrationResult: () => dispatch(Actions.registration.resetRegistrationResult()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm)
