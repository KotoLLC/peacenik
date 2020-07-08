import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import { TabsWrapper, TabStyled, TabsStyled, Header } from '@view/shared/styles'
import { withRouter, RouteComponentProps } from 'react-router'

const FriendTabs: React.SFC<RouteComponentProps> = React.memo((props) => {
  const [currentTab, onTabChange] = useState<number>(0)
  const { history, location } = props

  useEffect(() => {
    if (location.pathname.indexOf('all') !== -1) {
      onTabChange(0)
    }

    if (location.pathname.indexOf('potential') !== -1) {
      onTabChange(1)
    }

    if (location.pathname.indexOf('invitations') !== -1) {
      onTabChange(2)
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
            <TabStyled label="Friends" onClick={() => history.push('/friends/all')} />
            <TabStyled label="Potential friends" onClick={() => history.push('/friends/potential')} />
            <TabStyled label="Invites" onClick={() => history.push('/friends/invitations')} />
          </TabsStyled>
        </Paper>
      </TabsWrapper>
    </Header>
  )
})

export default withRouter(FriendTabs)