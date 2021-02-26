import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ProfileSettingsPage } from './ProfileSettingsPage'
import { SettingsLayout } from './../layouts/SettingsLayout'

export const SettingsPages = (props) => {
  return (
    <Switch>
      <SettingsLayout>
        <Route path="/settings" exact component={ProfileSettingsPage} />
      </SettingsLayout>
    </Switch>
  )
}
