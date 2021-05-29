import React from 'react'
import { ProfileSettingsContent } from './../components/styles'
import SettingsProfileForm from '../components/SettingsProfileForm'
import ChangePasswordForm from '../components/ChangePasswordForm'
import { DangerZone } from '../components/DangerZone'

export const ProfileSettingsPage = () => {
  return (
    <>
      <ProfileSettingsContent>
        <SettingsProfileForm />
      </ProfileSettingsContent>
      <ProfileSettingsContent>
        <ChangePasswordForm />
        <DangerZone />
      </ProfileSettingsContent>
    </>
  )
}