import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import { TabsWrapper, TabStyled, TabsStyled, Header } from '@view/shared/styles'
import { withRouter, RouteComponentProps } from 'react-router'

const NodeTabs: React.SFC<RouteComponentProps> = React.memo((props) => {
  const [currentTab, onTabChange] = useState<number>(0)
  const { history, location } = props

  useEffect(() => {
    if (location.pathname.indexOf('create') !== -1) {
      onTabChange(0)
    }

    if (location.pathname.indexOf('list') !== -1) {
      onTabChange(1)
    }
  }, [location.pathname])

  return (
    <Header>
      <TabsWrapper>
        <Paper>
          <TabsStyled
            value={currentTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, newTab) => onTabChange(newTab)}
            centered>
            <TabStyled label="Request Node" onClick={() => history.push('/nodes/create')} />
            <TabStyled label="Node List" onClick={() => history.push('/nodes/list')} />
          </TabsStyled>
        </Paper>
      </TabsWrapper>
    </Header>
  )
})

export default withRouter(NodeTabs)