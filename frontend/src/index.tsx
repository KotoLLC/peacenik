import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { ErrorBoundary } from '@view/ErrorBoundary'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { store } from '@store/store'
import { Routes } from '@view/routes'
import Notify from '@view/shared/Notify'
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
  onGetAuthToken: () => void
}

class AppComponent extends React.Component<Props> {

  checkTokenTime = () => {
    const authTokenDate = localStorage.getItem('kotoAuthTokenDate')

    if (authTokenDate) {
      const lastTokenDate = moment(JSON.parse(authTokenDate))
      const dateNow = new Date()
      const diffTime = moment(dateNow).diff(lastTokenDate) / 1000 // in seconds

      if (diffTime > 1800) {
        this.props.onGetAuthToken()  
      }

    } else {
      this.props.onGetAuthToken()
    }
  }

  componentDidMount() {  
    
    if (this.props.isLogged) {
      this.checkTokenTime()
    }

    setInterval(() => {
      if (this.props.isLogged) {
        this.checkTokenTime()
      }
    }, 5000)
  }

  render() {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
          <Notify />
        </ThemeProvider>
      </ErrorBoundary>
    )
  }
}

type StateProps = Pick<Props, 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
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
