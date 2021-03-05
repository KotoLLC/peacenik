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
  onGetHubs: () => void
}

const HubSettingsPage: React.FC<Props> = (props) => {
  const [isHubsRequested, setHubsRequested] = useState<boolean | null>(null)
  const [hubCreationStatus, setHubCreationStatus] = useState<CommonTypes.HubTypes.CreationStatus>('')
  const [myActiveHub, setMyActiveHub] = useState<CommonTypes.HubTypes.Hub>({
    domain: '', 
    author: '', 
    created: '', 
    aproved: '', 
    description: '',
    id: ''
  })
  const { onGetHubs, hubsList, userName } = props

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
          <HubMajorInfo {...myActiveHub} />
          <HubStepsInfo isHubActive={true}/>
        </>
      )
    }

    return (
      <>
        <HubMajorInfo {...myActiveHub} />
        <HubStepsInfo isHubActive={false}/>
        <HubOptionA />
        <HubOptionB hubCreationStatus={hubCreationStatus} />
      </>
    )
  }

  useEffect(() => {
    if (hubsList.length) {
      checkIsPosiblyCreateHub()
    }

    if (isHubsRequested === null) {
      setHubsRequested(true)
      onGetHubs()
    }

  }, [isHubsRequested, hubsList, hubCreationStatus])

  return (
    <ProfileSettingsContent>
      {renderCurrentView()}
    </ProfileSettingsContent>
  )
}

type StateProps = Pick<Props, 'hubsList' | 'userName'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  hubsList: selectors.hubs.hubsList(state),
  userName: selectors.profile.userName(state),
})

type DispatchProps = Pick<Props, 'onGetHubs'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetHubs: () => dispatch(Actions.hubs.getHubsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HubSettingsPage)