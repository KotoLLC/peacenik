import React from 'react'
import ReactDOM from 'react-dom'
import Notifications, { notify } from 'react-notify-toast'
import { connect } from 'react-redux'
import { StoreTypes } from './../../types/store'
import Actions from '@store/actions'
import selectors from '@selectors/index'

const modalRoot = document.getElementById('modal')

export interface Props {
  errorMessage: string
  successMessage: string
  isEmailConfirmed: boolean
  setErrorNotify: (text: string) => void
  setSuccessNotify: (text: string) => void
}

class Notify extends React.PureComponent<Props> {

  timerID

  mapNotification = () => {
    const { isEmailConfirmed } = this.props
    if (!modalRoot) return false

    return ReactDOM.createPortal((
        <Notifications options={{zIndex: 3000, top: (isEmailConfirmed) ? '64px' : '0px'}} />
    ), modalRoot)
  }

  componentDidUpdate() {
    const { errorMessage, successMessage } = this.props

    if (errorMessage) {
      notify.show((errorMessage), 'error', 4000)
      this.timerID = setTimeout(() => this.props.setErrorNotify(''), 5000)
    }

    if (successMessage) {
      notify.show(successMessage, 'success', 3000)
      this.timerID = setTimeout(() => this.props.setSuccessNotify(''), 4000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerID)
  }

  render() {
    const { errorMessage, successMessage } = this.props

    if (errorMessage || successMessage) {
      return this.mapNotification()
    } else return null
  }
}

type StateProps = Pick<Props, 'errorMessage' | 'successMessage' | 'isEmailConfirmed'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
  errorMessage: state.common.errorMessage,
  successMessage: state.common.successMessage,
})

type DispatchProps = Pick<Props, 'setErrorNotify' | 'setSuccessNotify'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
    setErrorNotify: (value: string) => dispatch(Actions.common.setErrorNotify(value)),
    setSuccessNotify: (value: string) => dispatch(Actions.common.setSuccessNotify(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notify)
