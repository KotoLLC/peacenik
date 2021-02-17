import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import {
  ButtonOutlined,
  CoverBarWrapper,
  CoverBarContainer,
  CoverBarCounterWrapper,
  CoverBarCounter,
  CoverBarCounterName,
  CoverBarCounters,
  CoverBarButtonsWrapper,
} from '@view/shared/styles'

interface Props {
  className?: string
}

const UserCoverBar: React.FC<Props> = (props) => {
  const {
    className,
  } = props

  const [isRequested, setReauested] = useState<boolean>(false)

  const renderCurrentButton = () => {
    return (
      <ButtonOutlined
        onClick={() => { }}
        disabled={false}
        className="large">
        Button
      </ButtonOutlined>
    )
  }

  return (
    <CoverBarWrapper className={className}>
      <CoverBarContainer>
        <CoverBarCounters>
          <CoverBarCounterWrapper>
            <CoverBarCounterName>GROUPS</CoverBarCounterName>
            <CoverBarCounter>0</CoverBarCounter>
          </CoverBarCounterWrapper>
          <CoverBarCounterWrapper>
            <CoverBarCounterName>FRIENdS</CoverBarCounterName>
            <CoverBarCounter>0</CoverBarCounter>
          </CoverBarCounterWrapper>
        </CoverBarCounters>
        <CoverBarButtonsWrapper>
          {renderCurrentButton()}
        </CoverBarButtonsWrapper>
      </CoverBarContainer>
    </CoverBarWrapper>
  )
}

// type StateProps = Pick<Props, 'isGroupLeavedSuccess' | 'errorMessage'>
// const mapStateToProps = (state: StoreTypes): StateProps => ({
//   errorMessage: selectors.common.errorMessage(state),
//   isGroupLeavedSuccess: selectors.groups.isGroupLeavedSuccess(state),
// })

// type DispatchProps = Pick<Props, 'onLeaveGroupRequest' | 'onLeaveGroupSuccess' | 'onDeleteJoinRequest'>
// const mapDispatchToProps = (dispatch): DispatchProps => ({
//   onLeaveGroupRequest: (value: string) => dispatch(Actions.groups.leaveGroupRequest(value)),
//   onLeaveGroupSuccess: (value: boolean) => dispatch(Actions.groups.leaveGroupSuccess(value)),
//   onDeleteJoinRequest: (data: ApiTypes.Groups.DeleteJoinRequest) => dispatch(Actions.groups.deleteJoinRequest(data)),
// })

// export default connect(mapStateToProps, mapDispatchToProps)(UserCoverBar)
export default connect()(UserCoverBar)