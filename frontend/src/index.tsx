import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { ErrorBoundary } from '@view/ErrorBoundary'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { store } from '@store/store'
import { Routes } from '@view/routes'
import Notify from '@view/shared/Notify'
import PreloaderFullScreen from '@view/shared/PreloaderFullScreen'
import { StoreTypes } from './types'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import moment from 'moment'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
})

interface Props {
  isLogged: boolean
  isEmailConfirmed: boolean
  onGetAuthToken: () => void
}

class AppComponent extends React.Component<Props> {

  checkTokenTime = () => {
    const authTokenDate = localStorage.getItem('kotoAuthTokenDate')
    const { isEmailConfirmed } = this.props

    if (authTokenDate && isEmailConfirmed) {
      const lastTokenDate = moment(JSON.parse(authTokenDate))
      const dateNow = new Date()
      const diffTime = moment(dateNow).diff(lastTokenDate) / 1000 // in seconds

      if (diffTime > 1800) {
        this.props.onGetAuthToken()  
      }
    }

    // else {
    //   this.props.onGetAuthToken()
    // }
  }

  componentDidMount() {  
    
    if (this.props.isLogged) {
      this.checkTokenTime()
    }

    setInterval(() => {
      if (this.props.isLogged) {
        this.checkTokenTime()
      }
    }, 60 * 1000)
  }

  render() {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
          <Notify />
          <PreloaderFullScreen />
        </ThemeProvider>
      </ErrorBoundary>
    )
  }
}

type StateProps = Pick<Props, 'isLogged' | 'isEmailConfirmed'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
})

type DispatchProps = Pick<Props, 'onGetAuthToken'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetAuthToken: () => dispatch(Actions.authorization.getAuthTokenRequest())
})

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root') as HTMLElement)
