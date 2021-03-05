import React from 'react'
import {
  HubSettingsBlock,
  CreationHubWrapper,
  CreationHubTitle,
  CreationHubStepsWrapper,
  CreationHubStepWrapper,
  CreationHubStepIcon,
  CreationHubStepDescription,
  CreationHubNote,
  HubLink,
} from './styles'
import StepIcon1 from '@assets/images/hub-step-icon-1.svg'
import StepIcon2 from '@assets/images/hub-step-icon-2.svg'
import StepIcon3 from '@assets/images/hub-step-icon-3.svg'

export const HubStepsInfo = React.memo(() => {
  return (
    <HubSettingsBlock>
      <CreationHubWrapper>
        <CreationHubTitle>Create your own message hub!</CreationHubTitle>
        <CreationHubStepsWrapper>
          <CreationHubStepWrapper>
            <CreationHubStepIcon src={StepIcon1}/>
            <CreationHubStepDescription>Store your own messages, photos, and videos</CreationHubStepDescription>
          </CreationHubStepWrapper>
          <CreationHubStepWrapper>
            <CreationHubStepIcon src={StepIcon2}/>
            <CreationHubStepDescription>Give storage for your friends, or they friends as well</CreationHubStepDescription>
          </CreationHubStepWrapper>
          <CreationHubStepWrapper>
            <CreationHubStepIcon src={StepIcon3}/>
            <CreationHubStepDescription>Host your server on any cloud</CreationHubStepDescription>
          </CreationHubStepWrapper>
        </CreationHubStepsWrapper>
        <CreationHubNote>
          You can (A) activate a <HubLink to="">sponsored hub</HubLink> or (B) <HubLink to="">create a hub</HubLink> yourself.
        </CreationHubNote>
      </CreationHubWrapper>
    </HubSettingsBlock>
  )
})