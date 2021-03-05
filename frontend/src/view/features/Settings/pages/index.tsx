import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ProfileSettingsPage } from './ProfileSettingsPage'
import { SettingsLayout } from './../layouts/SettingsLayout'
import { HubSettingsPage } from './HubSettingsPage'

export const SettingsPages = (props) => {
  return (
    <Switch>
      <SettingsLayout>
        <Route path="/settings" exact component={ProfileSettingsPage} />
        <Route path="/settings/hub" exact component={HubSettingsPage} />
      </SettingsLayout>
    </Switch>
  )
}
