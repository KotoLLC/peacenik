import React from 'react'
import Paper from '@material-ui/core/Paper'
import { TabsWrapper, TabStyled, TabsStyled } from './styles'
import { FriendsTypes } from './../../../types'

interface Props {
  onTabClick: (value: FriendsTypes.CurrentTab) => void
}

export const Tabs: React.SFC<Props> = React.memo((props) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const { onTabClick } = props

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
          <TabStyled label="My Friends" onClick={() => onTabClick('friends')}/>
          <TabStyled label="Friends of Friends" onClick={() => onTabClick('friends-of-friends')}/>
        </TabsStyled>
      </Paper>
    </TabsWrapper>
  )
})