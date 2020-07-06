import { NodeCreation, Props } from './NodeCreation'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import { StoreTypes, ApiTypes } from '../../../types'

type StateProps = Pick<Props, 'isNodeCreatedSuccessfully'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isNodeCreatedSuccessfully: selectors.nodes.isNodeCreatedSuccessfully(state),
})

type DispatchProps = Pick<Props, 'onNodeCreate' | 'onNodeCreationStatusReset'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onNodeCreate: (data: ApiTypes.Nodes.Create) => dispatch(Actions.nodes.nodeCreateRequest(data)),
  onNodeCreationStatusReset: () => dispatch(Actions.nodes.nodeCreationStatusReset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NodeCreation)