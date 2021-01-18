import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import queryString from 'query-string'
import { ApiTypes, StoreTypes } from 'src/types'
import AdminLauout from './AdminLauout'

interface Props extends RouteComponentProps {
  groupDetails: ApiTypes.Groups.GroupDetails | null
  userId: string

  onGetGroupDetailsRequest: (value: string) => void
}

const GroupPage: React.FC<Props> = (props) => {
  const { 
    onGetGroupDetailsRequest, 
    location, 
    groupDetails, 
    userId,
  } = props

  const url = location.search
  const params = queryString.parse(url)
  const groupId = params.id ? params.id : ''

  useEffect(() => {
    if (groupDetails?.group?.id !== groupId) {
      onGetGroupDetailsRequest(groupId as string)
    }
  }, [groupDetails, userId])

  if (groupDetails && groupDetails?.group?.admin?.id === userId) {
    return <AdminLauout/>
  } else {
    return <>Member layput</>
  }
}

type StateProps = Pick<Props, 'groupDetails' | 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  groupDetails: selectors.groups.groupDetails(state),
  userId: selectors.profile.userId(state),
})

type DispatchProps = Pick<Props, 'onGetGroupDetailsRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetGroupDetailsRequest: (value: string) => dispatch(Actions.groups.getGroupDetailsRequest(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage)
