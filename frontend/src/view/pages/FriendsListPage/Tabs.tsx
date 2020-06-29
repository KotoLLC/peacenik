import React from 'react'
import Paper from '@material-ui/core/Paper'
import { TabsWrapper, TabStyled, TabsStyled } from './styles'

export const Tabs: React.SFC = React.memo(() => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabsWrapper>
      <Paper>
        <TabsStyled
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <TabStyled label="My Friends" />
          <TabStyled label="Friends of Friends" />
        </TabsStyled>
      </Paper>
    </TabsWrapper>
  )
})