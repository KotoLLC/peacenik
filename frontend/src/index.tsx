import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { ErrorBoundary } from '@view/ErrorBoundary'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { store } from '@store/store'
import { Routes } from '@view/routes'
import Notify from '@view/shared/Notify'
// import ConnectionErrorPopup from './view/shared/ConnectionErrorPopup'
import { StoreTypes } from 'src/types'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import moment from 'moment'
import 'video-react/dist/video-react.css'
import 'react-awesome-slider/dist/styles.css'
import 'github-markdown-css'
import './assets/styles/pullToResresh.css'
import './assets/styles/mentions.css'
import './assets/styles/fonts.css'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    background: #F6F7FB;
    color: #262626;
    position: relative;
    min-height: 100vh;
    font-size: 16px;
    font-family: 'SFUITextRegular';
  }

  h1, h2, h3, h4, h5, h6, p, figure, ul, li, img {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline; 
  }

  article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block; 
  }

  ol, ul {
    list-style: none; 
  }

  table {
    border-collapse: collapse;
    border-spacing: 0; 
  }

  button {
    outline: none;
    border: none;
  }

  a {
    outline: none;
    text-decoration: none;
  }

  pre {
    margin: 0;
  }
`

const defaultTheme = createMuiTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
})

const { breakpoints } = defaultTheme

const theme = {
  ...defaultTheme,
  overrides: {
    MuiSwitch: {
      switchBase: {
        // Controls default (unchecked) color for the thumb
        color: "#ccc"
      },
      colorSecondary: {
        "&$checked": {
          // Controls checked color for the thumb
          color: "#599C0B"
        }
      },
      track: {
        // Controls default (unchecked) color for the track
        opacity: 0.2,
        backgroundColor: "#ccc",
        "$checked$checked + &": {
          // Controls checked color for the track
          opacity: 0.7,
          backgroundColor: "#599C0B"
        }
      }
    },
    MuiTypography: {
      h1: {
        [breakpoints.down('xs')]: {
          fontSize: '3rem'
        }
      },
      h2: {
        [breakpoints.down('xs')]: {
          fontSize: '2rem'
        }
      },
      h3: {
        [breakpoints.down('xs')]: {
          fontSize: '2rem'
        }
      },
    }
  }
}

interface Props {
  isLogged: boolean
  isEmailConfirmed: boolean
  authToken: string

  onGetAuthToken: () => void
  onGetNotifications: () => void
  onGetProfile: () => void
}

interface State {
  isDataGot: boolean
}

class AppComponent extends React.Component<Props, State> {

  state = {
    isDataGot: false,
  }

  checkTokenTime = () => {
    const authTokenDate = localStorage.getItem('peacenikAuthTokenDate')
    const { isEmailConfirmed } = this.props

    if (authTokenDate && isEmailConfirmed) {

      const lastTokenDate = moment(JSON.parse(authTokenDate))
      const dateNow = new Date()
      const diffTime = moment(dateNow).diff(lastTokenDate) / 1000 // in seconds

      if (diffTime > 1800) {
        this.props.onGetAuthToken()
      }
    }

  }

  static getDerivedStateFromProps(newProps: Props, prevState: State) {
    if (newProps.isLogged && newProps.authToken && !prevState.isDataGot) {
      newProps.onGetProfile()
      newProps.onGetNotifications()

      return {
        isDataGot: true
      }
    }

    return null
  }

  componentDidMount() {
    if (this.props.isLogged) {
      this.checkTokenTime()
    }

    setInterval(() => {
      if (this.props.isLogged && this.props.authToken) {
        this.checkTokenTime()
        this.props.onGetNotifications()
      }
    }, 60 * 1000)
  }

  render() {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={theme} >
          <CssBaseline />
          <Routes />
          <Notify />
          {/* <ConnectionErrorPopup /> */}
        </ThemeProvider>
        <GlobalStyle />
      </ErrorBoundary>
    )
  }
}

type StateProps = Pick<Props, 'isLogged' | 'isEmailConfirmed' | 'authToken'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
  authToken: selectors.authorization.authToken(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
})

type DispatchProps = Pick<Props, 'onGetAuthToken' | 'onGetNotifications' | 'onGetProfile'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetAuthToken: () => dispatch(Actions.authorization.getAuthTokenRequest()),
  onGetNotifications: () => dispatch(Actions.notifications.getNotificationsRequest()),
  onGetProfile: () => dispatch(Actions.profile.getProfileRequest()),
})

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent)
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root') as HTMLElement)
