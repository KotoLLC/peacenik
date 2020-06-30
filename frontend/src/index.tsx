import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ErrorBoundary } from '@view/ErrorBoundary'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { store } from '@store/store'
import { Routes } from '@view/routes'
import Notify from '@view/shared/Notify'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
})

class App extends React.Component<{}> {

  render() {
    return (
      <Provider store={store}>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes/>
            <Notify/>
          </ThemeProvider>
        </ErrorBoundary>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
