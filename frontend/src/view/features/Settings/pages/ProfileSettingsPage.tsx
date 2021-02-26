import React from 'react'
import { ProfileSettingsContent } from './../components/styles'
import SettingsProfileForm from '../components/SettingsProfileForm'
import ChangePasswordForm from '../components/ChangePasswordForm'

export const ProfileSettingsPage = () => {
  return (
    <>
      <ProfileSettingsContent>
        <SettingsProfileForm />
      </ProfileSettingsContent>
      <ProfileSettingsContent>
        <ChangePasswordForm/>
      </ProfileSettingsContent>
    </>
  )
}