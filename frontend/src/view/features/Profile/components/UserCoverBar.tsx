import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import selectors from '@selectors/index'
import { ApiTypes, StoreTypes } from 'src/types'
import { CoverBarDropdown } from './CoverBarDropdown'
import RemoveFriendDialog from './RemoveFriendDialog'
import { history } from '@view/routes'
import {
  CoverBarWrapper,
  CoverBarContainer,
  CoverBarCounterWrapper,
  CoverBarCounter,
  CoverBarCounterName,
  CoverBarCounters,
  CoverBarButtonsWrapper,
  CircularProgressWhite,
  ButtonContained,
} from '@view/shared/styles'
import { ButtonOutlinedStyled, ButtonContainedStyled } from './styles'

interface Props {
  id?: string
  userName?: string
  className?: string
  friendsLenght: number
  inviteStatus?: ApiTypes.Friends.InvitationStatus
  groupCount?: number
  errorMessage: string
  isUser: Boolean

  onAddFriend: (data: ApiTypes.Friends.Request) => void
}

const UserCoverBar: React.FC<Props> = React.memo((props) => {
  const {
    className,
    friendsLenght,
    id,
    onAddFriend,
    userName,
    inviteStatus,
    errorMessage,
    groupCount,
    isUser
  } = props
  const [isRequest, setRequest] = useState<boolean>(false)
  const [isUnfriendDialogOpen, openUnfriendDialog] = useState<boolean>(false)

  const renderCurrentButton = () => {

    if (inviteStatus === 'accepted') return (
      <ButtonOutlinedStyled
        className="large grey"
        onClick={() => openUnfriendDialog(true)}>
        Remove friend
      </ButtonOutlinedStyled>
    )

    if (inviteStatus === 'pending') return (
      <ButtonContainedStyled
        className="large grey"
        disabled>
        Request sent
      </ButtonContainedStyled>
    )

    if (inviteStatus === 'rejected') {
      return (
        <ButtonContainedStyled
          className="large"
          disabled={isRequest}
          onClick={onButtonClick}>
          {isRequest ? <CircularProgressWhite size={20} /> : 'Add friend'}
        </ButtonContainedStyled>
      )
    } else {
      return (
        <ButtonContainedStyled
          onClick={onButtonClick}
          disabled={isRequest}
          className="large">
          {isRequest ? <CircularProgressWhite size={20} /> : 'Add friend'}
        </ButtonContainedStyled>
      )
    }
  }

  const onButtonClick = () => {
    if (!id) return null

    setRequest(true)
    onAddFriend({ friend: id })
  }

  useEffect(() => {
    setRequest(false)
  }, [props, errorMessage])

  return (
    <CoverBarWrapper className={className}>
      <CoverBarContainer>
        <CoverBarCounters>
          <CoverBarCounterWrapper>
            <CoverBarCounterName>GROUPS</CoverBarCounterName>
            <CoverBarCounter>{groupCount || 0}</CoverBarCounter>
          </CoverBarCounterWrapper>
          <CoverBarCounterWrapper>
            <CoverBarCounterName>FRIENdS</CoverBarCounterName>
            <CoverBarCounter>{friendsLenght}</CoverBarCounter>
          </CoverBarCounterWrapper>
        </CoverBarCounters>
        {isUser && <ButtonContained onClick={() => {history.push('/settings')}}>
            Edit Profile
          </ButtonContained>}
        {!isUser && <CoverBarButtonsWrapper className="profile">
          {renderCurrentButton()}
          <ButtonOutlinedStyled disabled className="large">
            Send message
          </ButtonOutlinedStyled>
          <CoverBarDropdown userId={id!}/>
        </CoverBarButtonsWrapper> }
      </CoverBarContainer>
      <RemoveFriendDialog 
        userId={id!}
        userName={userName!}
        isOpen={isUnfriendDialogOpen}
        setOpen={openUnfriendDialog}
      />
    </CoverBarWrapper>
  )
})

 type StateProps = Pick<Props, 'errorMessage'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  errorMessage: selectors.common.errorMessage(state),
})

type DispatchProps = Pick<Props, 'onAddFriend'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onAddFriend: (data: ApiTypes.Friends.Request) => dispatch(Actions.friends.addFriendRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserCoverBar)