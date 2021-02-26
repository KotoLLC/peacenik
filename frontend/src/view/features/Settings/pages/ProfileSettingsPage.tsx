import React from 'react'
import { ProfileSettingsContent } from './../components/styles'
import { ProfileForm } from './../components/ProfileForm'
import { PasswordForm } from './../components/PasswordForm'

export const ProfileSettingsPage = () => {
  return (
    <>
      <ProfileSettingsContent>
        <ProfileForm />
      </ProfileSettingsContent>
      <ProfileSettingsContent>
        <PasswordForm/>
      </ProfileSettingsContent>
    </>
  )
}