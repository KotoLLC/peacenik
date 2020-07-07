import React from 'react'
import Paper from '@material-ui/core/Paper'
import { TabsWrapper, TabStyled, TabsStyled, Header } from '@view/shared/styles'
import { withRouter, RouteComponentProps } from 'react-router'

interface State {
  currentTab: number
}

interface Props extends RouteComponentProps {}

class NodeTabs extends React.PureComponent<Props, State> {

  state = {
    currentTab: 0
  }

  onTabChange = (event, newValue) => {
    this.setState({
      currentTab: newValue
    })
  }

  static getDerivedStateFromProps(nextProps: Props) {

    const checkCurrentTab = () => {
      if (nextProps.location.pathname.indexOf('create') !== -1) {
        return 0
      }
  
      if (nextProps.location.pathname.indexOf('list') !== -1) {
        return 1
      }
    }

    return {
      currentTab: checkCurrentTab()
    }
  }

  render() {
    const { history } = this.props
    const { currentTab } = this.state

    return (
      <Header>
        <TabsWrapper>
          <Paper>
            <TabsStyled
              value={currentTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.onTabChange}
              centered>
              <TabStyled label="Request Node" onClick={() => history.push('/nodes/create')} />
              <TabStyled label="Node List" onClick={() => history.push('/nodes/list')} />
            </TabsStyled>
          </Paper>
        </TabsWrapper>
      </Header>
    )
  }
}

export default withRouter(NodeTabs)