import React from 'react'
import { dateToRelateString } from '@services/dateToRelateString'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router'
import Actions from '@store/actions'
import { CommonTypes, ApiTypes, StoreTypes } from 'src/types'
import { ModalDialog } from '@view/shared/ModalDialog'
import {
  MessageContentType
} from '../../../../../types/enum'
import {
  ModalSubTitle,
  ModalButtonsGroup,
  ModalCancelButton,
  ModalAllowButton,
} from '@view/shared/ModalDialog/styles'
import {
  MessageTextContent,
  MessageTextContentBody,
  MessageTextContentFooter,
  MessageItemWrapper,
  MessageTransmissionTime,
  DirectMsgCloseIcon,
  MessageImageContent,
  MessageImageContentBody,
  MessageImageContentFooter,
} from '../styles'

const MessageItem: React.FC<CommonTypes.MessageTypes.MessageItemProps> = ({
  direction,
  actionTime,
  status,
  msgId,
  contentType,
  messeageContent,
}: CommonTypes.MessageTypes.MessageItemProps) => {
  
  const friend_id = useRouteMatch().params['id'] || undefined
  const [isOpen, setOpen] = React.useState(false)

  const dispatch = useDispatch()
  const directPostToken = useSelector( (state: StoreTypes) => state.messages.directPostToken )
  const deleteMessage = () => {
    dispatch(Actions.messages.deleteDirectMsgRequest({
      host: directPostToken ? directPostToken.host : "",
      body: {
        message_id: msgId,
        friend_id: friend_id
      }
    }))
    setOpen(false)
  }

  return (
    <>
    <MessageItemWrapper justify-content={direction}>
      {(direction === "outgoing") && <DirectMsgCloseIcon onClick={() => setOpen(true)} /> }
      {/* message  */}
      {contentType === MessageContentType.TEXT_TYPE && (
        <MessageTextContent color={direction}>
          <MessageTextContentBody>{messeageContent}</MessageTextContentBody>
          <MessageTextContentFooter>
            <MessageTransmissionTime color={direction}>
              {dateToRelateString(actionTime)}
            </MessageTransmissionTime>
          </MessageTextContentFooter>
        </MessageTextContent>
      )}
      {contentType === MessageContentType.IMAGE_TYPE && (
        <MessageImageContent color={direction}>
          <MessageImageContentBody
            src={messeageContent.toString()}
            alt='IMAGE'
          />
          <MessageImageContentFooter color={direction}>
            <MessageTransmissionTime color={direction}>
              {dateToRelateString(actionTime)}
            </MessageTransmissionTime>
          </MessageImageContentFooter>
        </MessageImageContent>
      )}
    </MessageItemWrapper>
    <ModalDialog
        isModalOpen={isOpen}
        setOpenModal={() => setOpen(!isOpen)}>
        <ModalSubTitle>Do you really want to remove this message?</ModalSubTitle>
        <ModalButtonsGroup>
          <ModalCancelButton onClick={() => setOpen(false)}>Cancel</ModalCancelButton>
          <ModalAllowButton onClick={deleteMessage}>Remove</ModalAllowButton>
        </ModalButtonsGroup>
      </ModalDialog>
    </>
  )
}

export default MessageItem
