import { connect } from 'react-redux'
import { ResetPassword, Props } from './ResetPassword'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'

type StateProps = Pick<Props, 'passwordErrorMessage' | 'isResetPasswordSuccess'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    passwordErrorMessage: selectors.authorization.passwordErrorMessage(state),
    isResetPasswordSuccess: selectors.authorization.isResetPasswordSuccess(state),
})

type DispatchProps = Pick<Props, 'onResetPasswordRequest' | 'onCleanPasswordFailedMessage'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onResetPasswordRequest: (data: ApiTypes.ResetPassword) => dispatch(Actions.authorization.resetPasswordRequest(data)),
    onCleanPasswordFailedMessage: () => dispatch(Actions.authorization.cleanPasswordFailedMessage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
