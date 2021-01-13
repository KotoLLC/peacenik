import React from 'react'
import { 
  DangerZoneWrapper,
  DangerZoneTitle, 
} from './styles'
import { ButtonContained } from '@view/shared/styles'

export const DangerZone = React.memo(() => {
  return (
    <DangerZoneWrapper>
      <DangerZoneTitle>Danger Zone</DangerZoneTitle>
      <ButtonContained className="small gray">Destroy</ButtonContained>
    </DangerZoneWrapper>
  )
})