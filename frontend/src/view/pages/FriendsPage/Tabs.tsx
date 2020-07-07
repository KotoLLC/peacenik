import React from 'react'
import Paper from '@material-ui/core/Paper'
import { TabsWrapper, TabStyled, TabsStyled } from '@view/shared/styles'
import { FriendTypes } from '../../../types'

interface Props {
  onTabClick: (value: FriendTypes.CurrentTab) => void
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
          <TabStyled label="Friends" onClick={() => onTabClick('friends')}/>
          <TabStyled label="Potential friends" onClick={() => onTabClick('friends-of-friends')}/>
          <TabStyled label="Invites" onClick={() => onTabClick('invitations')}/>
        </TabsStyled>
      </Paper>
    </TabsWrapper>
  )
})