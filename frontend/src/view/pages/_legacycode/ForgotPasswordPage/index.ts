import { connect } from 'react-redux'
import { ForgotPassword, Props } from './ForgotPassword'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'

type StateProps = Pick<Props, 'passwordErrorMessage' | 'isForgotPasswordSent'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    passwordErrorMessage: selectors.authorization.passwordErrorMessage(state),
    isForgotPasswordSent: selectors.authorization.isForgotPasswordSent(state),
})

type DispatchProps = Pick<Props, 'onResetPasswordRequest' | 'onCleanPasswordFailedMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onResetPasswordRequest: (data: ApiTypes.ForgotPassword) => dispatch(Actions.authorization.forgotPasswordRequest(data)),
    onCleanPasswordFailedMessage: () => dispatch(Actions.authorization.cleanPasswordFailedMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
