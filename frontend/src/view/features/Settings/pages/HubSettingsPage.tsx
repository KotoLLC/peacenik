import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import selectors from '@selectors/index'
import Actions from '@store/actions'
import { StoreTypes, CommonTypes } from 'src/types'
import { ProfileSettingsContent } from '../components/styles'
import { HubMajorInfo } from './../components/HubMajorInfo'
import { HubStepsInfo } from './../components/HubStepsInfo'
import { HubOptionA } from './../components/HubOptionA'
import HubOptionB from './../components/HubOptionB'

interface Props {
  hubsList: CommonTypes.HubTypes.Hub[]
  userName: string
  currentHub: CommonTypes.HubTypes.CurrentHub
 
  onGetHubs: () => void
  onGetCurrentHub: () => void
}

const HubSettingsPage: React.FC<Props> = (props) => {
  const [isHubsRequested, setHubsRequested] = useState<boolean | null>(null)
  const [hubCreationStatus, setHubCreationStatus] = useState<CommonTypes.HubTypes.CreationStatus>('')
  const myActiveHubInitialState = {
    domain: '', 
    author: '', 
    created: '', 
    aproved: '', 
    description: '',
    id: ''
  }
  const [myActiveHub, setMyActiveHub] = useState<CommonTypes.HubTypes.Hub>(myActiveHubInitialState)
  const { onGetHubs, hubsList, userName, currentHub, onGetCurrentHub } = props

  const checkIsPosiblyCreateHub = () => {
    if (isHubsRequested !== null) {

      if (hubsList.length) {
        const currentHubs = hubsList.filter(item => item.author === userName)

        if (currentHubs.some(item => item.aproved !== '')) {
          setMyActiveHub(currentHubs.filter(item => item.aproved !== '')[0])  
          setHubCreationStatus('approved')
        } else {
          setMyActiveHub(currentHubs.filter(item => item.aproved === '')[0])  
          setHubCreationStatus('pending')
        }
      }
    }
  }

  const renderCurrentView = () => {
    if (hubCreationStatus === 'approved') {
      return (
        <>
          <HubMajorInfo {...myActiveHub} currentHub={currentHub}/>
          <HubStepsInfo isHubActive={true} myActiveHub={myActiveHub}/>
        </>
      )
    }

    return (
      <>
        <HubMajorInfo {...myActiveHub} currentHub={currentHub}/>
        <HubStepsInfo isHubActive={false} myActiveHub={myActiveHub}/>
        <HubOptionA />
        <HubOptionB hubCreationStatus={hubCreationStatus} />
      </>
    )
  }

  useEffect(() => {
    if (hubsList.length) {
      checkIsPosiblyCreateHub()
    } else {
      setMyActiveHub(myActiveHubInitialState)
      setHubCreationStatus('')
    }

    if (isHubsRequested === null) {
      setHubsRequested(true)
      onGetHubs()
      onGetCurrentHub()
    }

  }, [isHubsRequested, hubsList, hubCreationStatus, currentHub])

  return (
    <ProfileSettingsContent>
      {renderCurrentView()}
    </ProfileSettingsContent>
  )
}

type StateProps = Pick<Props, 'hubsList' | 'userName' | 'currentHub'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  hubsList: selectors.hubs.hubsList(state),
  userName: selectors.profile.userName(state),
  currentHub: selectors.messages.currentHub(state),
})

type DispatchProps = Pick<Props, 'onGetHubs' | 'onGetCurrentHub'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetHubs: () => dispatch(Actions.hubs.getHubsRequest()),
  onGetCurrentHub: () => dispatch(Actions.messages.getCurrentHubRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HubSettingsPage)