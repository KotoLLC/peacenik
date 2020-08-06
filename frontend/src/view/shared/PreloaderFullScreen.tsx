import React from 'react'
import ReactDOM from 'react-dom'
import { PreloaderViewport } from './styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import { StoreTypes } from 'src/types'
import selectors from '@selectors/index'

const modalRoot = document.getElementById('modal')

interface Props {
  isPreloaderActive: boolean
}

export const PreloaderFullScreen: React.SFC<Props> = React.memo((props) => {

  const { isPreloaderActive } = props
  
  if (!modalRoot || !isPreloaderActive) return null

  return ReactDOM.createPortal((
    <PreloaderViewport>
      <CircularProgress />
    </PreloaderViewport>
  ), modalRoot)

})

type StateProps = Pick<Props, 'isPreloaderActive'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isPreloaderActive: selectors.common.isPreloaderActive(state),
})

export default connect(mapStateToProps)(PreloaderFullScreen)