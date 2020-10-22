import React, { useState, useEffect, ChangeEvent } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import selectors from '@selectors/index'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import LayersClearIcon from '@material-ui/icons/LayersClear'
import PhotoIcon from '@material-ui/icons/Photo'
import { Player } from 'video-react'
import { getAvatarUrl } from '@services/avatarUrl'
import Avatar from '@material-ui/core/Avatar'
import loadImage from 'blueimp-load-image'
import SendIcon from '@material-ui/icons/Send'

import {
  TextareaAutosizeStyled,
  IconButtonWrapper,
  EditorPaperWrapper,
  TextareaTitle,
  CreateWrapper,
  EditorWrapper,
  MessageSticky,
  EditorButtonsWrapper,
  UploadInput,
  ImagePreview,
  AvatarWrapper,
  ErrorMessage,
  EditMessageField,
} from './styles'

interface Props {
  authToken: string
  currentHub: CommonTypes.HubTypes.CurrentHub
  isMessagePostedSuccess: boolean
  uploadLink: ApiTypes.UploadLink | null
  userId: string

  onMessagePost: (data: ApiTypes.Messages.PostMessage) => void
  onPostMessageSucces: (value: boolean) => void
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => void
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => void
}

const Editor: React.SFC<Props> = (props) => {
  const [value, onValueChange] = useState<string>('')
  const [isFileUploaded, setUploadedFile] = useState<boolean>(false)
  const [isHubsEmptyMessageShowed, showHubsEmptyMessage] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const { isMessagePostedSuccess, onPostMessageSucces, uploadLink } = props

  const onMessageSend = () => {

    if (!props.currentHub.host) {
      showHubsEmptyMessage(true)
      return false
    }

    if (value || file) {
      const data = {
        host: props.currentHub.host,
        body: {
          token: props.currentHub.token,
          text: value,
          attachment_id: uploadLink?.blob_id,
        }
      }
      setFile(null)
      props.onMessagePost(data)
    }

  }

  const onComandEnterDown = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onMessageSend()
    }
  }

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetMessageUploadLink } = props
    setUploadedFile(false)

    const uploadedFile = event.target.files
    if (uploadedFile && uploadedFile[0] && props.currentHub.host) {

      onGetMessageUploadLink({
        host: props.currentHub.host,
        content_type: uploadedFile[0].type,
        file_name: uploadedFile[0].name,
      })

      /* tslint:disable */
      loadImage(
        uploadedFile[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                setFile(newBlob)
              })
            }, 'image/jpeg')
          } else {
            setFile(uploadedFile[0])
          }
        },
        { meta: true, orientation: true, canvas: true }
      )
      /* tslint:enable */

    }
  }

  const renderAttachment = () => {
    if (file && file?.type.indexOf('image') !== -1) {
      return <ImagePreview src={URL.createObjectURL(file)} />
    }

    if (file && file?.type.indexOf('video') !== -1) {
      return (
        <Player>
          <source src={URL.createObjectURL(file)} />
        </Player>
      )
    }

    return null
  }

  const onFileDelete = () => {
    setFile(null)
  }

  useEffect(() => {
    if (isMessagePostedSuccess) {
      onValueChange('')
    }
    onPostMessageSucces(false)

    if (props.uploadLink && file && !isFileUploaded) {
      const { form_data } = props?.uploadLink
      const data = new FormData()

      for (let key in form_data) {
        data.append(key, form_data[key])
      }

      data.append('file', file, file?.name)

      props.onSetAttachment({
        link: props?.uploadLink.link,
        form_data: data,
      })

    }
  }, [isMessagePostedSuccess, uploadLink, file, isFileUploaded, onPostMessageSucces, props])

  return (
    <MessageSticky>
      <EditorPaperWrapper>
        <CreateWrapper>
          <AvatarWrapper>
            <Avatar src={getAvatarUrl(props.userId)} />
          </AvatarWrapper>
          <EditorWrapper>
            <TextareaTitle className={value.length ? 'active' : ''}>Post a message to your friends</TextareaTitle>
            <EditMessageField>
              <TextareaAutosizeStyled
                onKeyDown={onComandEnterDown}
                value={value}
                onChange={(evant) => onValueChange(evant.currentTarget.value)} />
              <IconButton onClick={onMessageSend}>
                <SendIcon fontSize="small" />
              </IconButton>
            </EditMessageField>
            {renderAttachment()}
            <EditorButtonsWrapper>
              <Tooltip title={`Attach image or video`}>
                <IconButtonWrapper>
                  <IconButton component="label">
                    <PhotoIcon fontSize="small" color="primary" />
                    <UploadInput
                      type="file"
                      id="file"
                      name="file"
                      onChange={onFileUpload}
                      accept="video/*,image/*"
                    />
                  </IconButton>
                </IconButtonWrapper>
              </Tooltip>
              {file && <Tooltip title={`Delete attachment`}>
                <IconButtonWrapper>
                  <IconButton component="label" onClick={onFileDelete}>
                    <LayersClearIcon fontSize="small" color="primary" />
                  </IconButton>
                </IconButtonWrapper>
              </Tooltip>}
              {/* <ButtonSend
                variant="contained"
                color="primary"
                onClick={onMessageSend}
              >Post</ButtonSend> */}
            </EditorButtonsWrapper>
            {isHubsEmptyMessageShowed && <ErrorMessage>You cannot post messages until you are friends with someone
                who has their own node. Alternatively, you can start a node yourself.</ErrorMessage>}
          </EditorWrapper>
        </CreateWrapper>
      </EditorPaperWrapper>
    </MessageSticky>
  )
}

type StateProps = Pick<Props, 'authToken' | 'currentHub' | 'isMessagePostedSuccess' | 'uploadLink' | 'userId'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  authToken: state.authorization.authToken,
  currentHub: selectors.messages.currentHub(state),
  isMessagePostedSuccess: selectors.messages.isMessagePostedSuccess(state),
  uploadLink: state.messages.uploadLink,
  userId: selectors.profile.userId(state),
})

type DispatchProps = Pick<Props, 'onMessagePost' | 'onPostMessageSucces' | 'onGetMessageUploadLink' | 'onSetAttachment'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessagePost: (data: ApiTypes.Messages.PostMessage) => dispatch(Actions.messages.postMessageRequest(data)),
  onPostMessageSucces: (value: boolean) => dispatch(Actions.messages.postMessageSucces(value)),
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => dispatch(Actions.messages.getMessageUploadLinkRequest(data)),
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => dispatch(Actions.messages.setAttachmentRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
