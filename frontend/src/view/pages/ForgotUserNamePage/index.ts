import { connect } from 'react-redux'
import { ForgotUserName, Props } from './ForgotUserName'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'

type StateProps = Pick<Props, 'isForgotUserNameSent'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
    isForgotUserNameSent: selectors.authorization.isForgotUserNameSent(state),
})

type DispatchProps = Pick<Props, 'onUserNameRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    onUserNameRequest: (data: ApiTypes.ForgotUserName) => dispatch(Actions.authorization.forgotUserNameRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotUserName)
