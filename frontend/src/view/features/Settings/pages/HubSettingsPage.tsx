import React from 'react'
import {
  ProfileSettingsContent,
} from '../components/styles'
import { HubMajorInfo } from './../components/HubMajorInfo'
import { HubStepsInfo } from './../components/HubStepsInfo'
import { HubOptionA } from './../components/HubOptionA'
import { HubOptionB } from './../components/HubOptionB'

export const HubSettingsPage = () => {
  return (
    <>
      <ProfileSettingsContent>
        <HubMajorInfo />
        <HubStepsInfo />
        <HubOptionA/>
        <HubOptionB/>
      </ProfileSettingsContent>
    </>
  )
}