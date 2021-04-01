import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import queryString from 'query-string'
import { ApiTypes, StoreTypes } from 'src/types'
import AdminPublicLayout from '../layouts/AdminPublicLayout'
import AdminPrivateLayout from '../layouts/AdminPrivateLayout'
import MemberLayout from '../layouts/MemberLayout'

interface Props extends RouteComponentProps {
  groupDetails: ApiTypes.Groups.GroupDetails | null
  userId: string

  onGetGroupDetailsRequest: (value: string) => void
  setCurrentGroupId: (value: string) => void
}

const GroupPage: React.FC<Props> = (props) => {
  const { 
    location, 
    groupDetails, 
    userId,
    onGetGroupDetailsRequest, 
    setCurrentGroupId,
  } = props

  const url = location.search
  const params = queryString.parse(url)
  const groupId = params.id ? params.id : ''

  useEffect(() => {
    setCurrentGroupId(groupId as string)

    if (groupDetails?.group?.id !== groupId) {
      onGetGroupDetailsRequest(groupId as string)
    }
  }, [groupDetails, userId])

  if (groupDetails && groupDetails?.group?.admin?.id === userId) {
    return (groupDetails?.group?.is_public === true) ? <AdminPublicLayout location={location}/> : <AdminPrivateLayout/>
  } else {
    return <MemberLayout/>
  }
}

type StateProps = Pick<Props, 'groupDetails' | 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  groupDetails: selectors.groups.groupDetails(state),
  userId: selectors.profile.userId(state),
})

type DispatchProps = Pick<Props, 'onGetGroupDetailsRequest' | 'setCurrentGroupId'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetGroupDetailsRequest: (value: string) => dispatch(Actions.groups.getGroupDetailsRequest(value)),
  setCurrentGroupId: (value: string) => dispatch(Actions.groups.setCurrentGroupId(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage)
