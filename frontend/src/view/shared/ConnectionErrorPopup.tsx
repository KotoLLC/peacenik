import React from 'react'
import PortableWifiOffIcon from '@material-ui/icons/PortableWifiOff'
import Button from '@material-ui/core/Button'
import {
  ConnectionErrorWrapper,
  RefreshButtonWrapper,
  ConnectionErorrTitle,
} from './styles'
import { connect } from 'react-redux'
import { StoreTypes } from 'src/types'
import Actions from '@store/actions'
import selectors from '@selectors/index'

interface Props {
  isConnectionError: boolean

  setConnectionError: (value: boolean) => void
}

const ConnectionErrorPopup: React.FC<Props> = (props) => {
  const { isConnectionError, setConnectionError } = props

  const onRefresh = () => {
    setConnectionError(false)
    window.location.reload()
  }

  if (!isConnectionError) return null

  return (
    <ConnectionErrorWrapper>
      <PortableWifiOffIcon color="secondary" fontSize="large" />
      <ConnectionErorrTitle>Connection error, try to refresh</ConnectionErorrTitle>
      <RefreshButtonWrapper>
        <Button
          variant="contained"
          color="primary"
          onClick={onRefresh}
        >refresh</Button>
      </RefreshButtonWrapper>
    </ConnectionErrorWrapper>
  )
}

type StateProps = Pick<Props, 'isConnectionError'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isConnectionError: selectors.common.isConnectionError(state),
})

type DispatchProps = Pick<Props, 'setConnectionError'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  setConnectionError: (value: boolean) => dispatch(Actions.common.setConnectionError(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionErrorPopup)
