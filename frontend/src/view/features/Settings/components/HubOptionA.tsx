import React from 'react'
import {
  HubSettingsBlock,
  HubOptionTitle,
  HubOptionText,
  ButtonWrapper,
  ButtonNote,
} from './styles'
import { ButtonContained } from '@view/shared/styles'

export const HubOptionA = React.memo(() => {
  return (
    <HubSettingsBlock>
      <HubOptionTitle>
        Option A: activate a sponsored hub
      </HubOptionTitle>
      <HubOptionText>This option is for non-technical folks or people who don't want to maintain their own server.</HubOptionText>
      <ButtonWrapper>
        <ButtonContained disabled>Coming soon</ButtonContained>
        <ButtonNote>in-app purchase</ButtonNote>
      </ButtonWrapper>
    </HubSettingsBlock>
  )
})