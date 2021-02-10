import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import JoinGroupDialog from './JoinGroupDialog'
import { ButtonOutlined } from '@view/shared/styles'
import {
  GroupHeader,
  HeaderContainer,
  HeaderCounterWrapper,
  HeaderCounter,
  HeaderCounterName,
  CountersWrapper,
  TopBarButtonWrapper,
  WarningText,
} from './styles'

interface Props {
  groupId: string
  isAdminLayout: boolean
  membersCounter?: number
  invitesCounter?: number
  className?: string
  memberStatus: ApiTypes.Groups.MemberStatus
  isGroupLeavedSuccess: boolean
  errorMessage: string
  isPublic: boolean

  onLeaveGroupSuccess: (value: boolean) => void
  onLeaveGroupRequest: (value: string) => void
  onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => void
}

const GroupTopBar: React.FC<Props> = (props) => {
  const {
    membersCounter,
    invitesCounter,
    groupId,
    isAdminLayout,
    memberStatus,
    onLeaveGroupRequest,
    errorMessage,
    isGroupLeavedSuccess,
    onLeaveGroupSuccess,
    onDeleteJoinRequest,
    className,
    isPublic,
  } = props

  const [isRequested, setReauested] = useState<boolean>(false)
  const [isButtonHover, setButtonHover] = useState<boolean>(false)

  const onLeaveGroup = () => {
    setReauested(true)
    onLeaveGroupRequest(groupId)
  }

  const renderCurrentButton = () => {

    if (memberStatus === 'member') {
      return (
        <ButtonOutlined
          onMouseOver={() => setButtonHover(true)}
          onMouseOut={() => setButtonHover(false)}
          onClick={onLeaveGroup}
          disabled={isRequested}
          className="large grey">
          Leave group
        </ButtonOutlined>
      )
    }
    if (memberStatus === 'pending') {
      return <ButtonOutlined 
        onClick={() => onDeleteJoinRequest({
          group_id: groupId,
        })}
        className="large green">
        Remove invite
      </ButtonOutlined>
    }
    if (memberStatus === '' || memberStatus === 'rejected') {
      return <JoinGroupDialog
        groupId={groupId}
        buttonClassName="large"
        buttonText="Join group"
      />
    }
  }

  useEffect(() => {
    if (isGroupLeavedSuccess || errorMessage) {
      setReauested(false)
      onLeaveGroupSuccess(false)
    }
  }, [isGroupLeavedSuccess, errorMessage, isButtonHover])

  if (isAdminLayout) {
    return (
      <GroupHeader className={className}>
        <HeaderContainer>
          <CountersWrapper>
            <HeaderCounterWrapper>
              <HeaderCounterName>INVITES</HeaderCounterName>
              <HeaderCounter>{invitesCounter}</HeaderCounter>
            </HeaderCounterWrapper>
            <HeaderCounterWrapper>
              <HeaderCounterName>MEMBERS</HeaderCounterName>
              <HeaderCounter>{membersCounter}</HeaderCounter>
            </HeaderCounterWrapper>
          </CountersWrapper>
          <Link to={`/groups/edit?id=${groupId}`}>
            <ButtonOutlined className="large">Edit group</ButtonOutlined>
          </Link>
        </HeaderContainer>
      </GroupHeader>
    )
  } else {
    return (
      <GroupHeader className={className}>
        <HeaderContainer>
          <TopBarButtonWrapper>
            {renderCurrentButton()}
          </TopBarButtonWrapper>
          {!isPublic && <WarningText>
            {isButtonHover && 'If you leave the group, you will not be able to return without the invitation from owner'}
          </WarningText>}
        </HeaderContainer>
      </GroupHeader>
    )
  }
}

type StateProps = Pick<Props, 'isGroupLeavedSuccess' | 'errorMessage'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: selectors.common.errorMessage(state),
  isGroupLeavedSuccess: selectors.groups.isGroupLeavedSuccess(state),
})

type DispatchProps = Pick<Props, 'onLeaveGroupRequest' | 'onLeaveGroupSuccess' | 'onDeleteJoinRequest'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onLeaveGroupRequest: (value: string) => dispatch(Actions.groups.leaveGroupRequest(value)),
  onLeaveGroupSuccess: (value: boolean) => dispatch(Actions.groups.leaveGroupSuccess(value)),
  onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => dispatch(Actions.groups.deleteJoinRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupTopBar)