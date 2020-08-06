import React, { useState, useEffect, ChangeEvent } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types'
import selectors from '@selectors/index'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { Player } from 'video-react'
import {
  TextareaAutosizeStyled,
  ButtonSend,
  TextareaTitle,
  CreateWrapper,
  PaperStyled,
  EditorWrapper,
  MessageSticky,
  EditorButtonsWrapper,
  UploadInput,
  ImagePreview,
} from './styles'

interface Props {
  authToken: string
  currentNode: CommonTypes.NodeTypes.CurrentNode
  isMessagePostedSuccess: boolean
  uploadLink: ApiTypes.UploadLink | null
  onMessagePost: (data: ApiTypes.Messages.PostMessage) => void
  onPostMessageSucces: (value: boolean) => void
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => void
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => void
}

const Editor: React.SFC<Props> = (props) => {
  const [value, onValueChange] = useState<string>('')
  const [isFileUploaded, setUploadedFile] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const { isMessagePostedSuccess, onPostMessageSucces, uploadLink } = props

  const onMessageSend = () => {
    if (value || file) {
      const data = {
        host: props.currentNode.host,
        body: {
          token: props.currentNode.token,
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
    if (uploadedFile && uploadedFile[0]) {
      onGetMessageUploadLink({
        host: props.currentNode.host,
        value: uploadedFile[0].type
      })
      setFile(uploadedFile[0])
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

  useEffect(() => {
    if (isMessagePostedSuccess) {
      onValueChange('')
    }
    onPostMessageSucces(false)

    if (props.uploadLink && file && !isFileUploaded) {
      const { form_data } = props?.uploadLink
      const data = new FormData()

      data.append('file', file, file?.name)

      for (let key in form_data) {
        data.append(key, form_data[key])
      }

      props.onSetAttachment({
        link: props?.uploadLink.link,
        form_data: data,
      })

    }
  }, [isMessagePostedSuccess, uploadLink])

  return (
    <MessageSticky>
      <PaperStyled>
        <CreateWrapper>
          <Avatar variant="rounded" />
          <EditorWrapper>
            <TextareaTitle className={value.length ? 'active' : ''}>Post a message to your friend</TextareaTitle>
            <TextareaAutosizeStyled
              value={value}
              onKeyDown={onComandEnterDown}
              onChange={(evant) => onValueChange(evant.currentTarget.value)} />
            {renderAttachment()}
            <EditorButtonsWrapper>
              <Tooltip title={`Attach image or video`}>
                <IconButton component="label">
                  <AttachFileIcon fontSize="small" color="primary" />
                  <UploadInput
                    type="file"
                    id="file"
                    name="file"
                    onChange={onFileUpload}
                    accept="video/*,image/*"
                  />
                </IconButton>
              </Tooltip>
              <ButtonSend
                variant="contained"
                color="primary"
                onClick={onMessageSend}
              >Post</ButtonSend>
            </EditorButtonsWrapper>
          </EditorWrapper>
        </CreateWrapper>
      </PaperStyled>
    </MessageSticky>
  )
}

type StateProps = Pick<Props, 'authToken' | 'currentNode' | 'isMessagePostedSuccess' | 'uploadLink'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  authToken: state.authorization.authToken,
  currentNode: selectors.messages.currentNode(state),
  isMessagePostedSuccess: selectors.messages.isMessagePostedSuccess(state),
  uploadLink: state.messages.uploadLink,
})

type DispatchProps = Pick<Props, 'onMessagePost' | 'onPostMessageSucces' | 'onGetMessageUploadLink' | 'onSetAttachment'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessagePost: (data: ApiTypes.Messages.PostMessage) => dispatch(Actions.messages.postMessageRequest(data)),
  onPostMessageSucces: (value: boolean) => dispatch(Actions.messages.postMessageSucces(value)),
  onGetMessageUploadLink: (data: ApiTypes.Messages.UploadLinkRequest) => dispatch(Actions.messages.getMessageUploadLinkRequest(data)),
  onSetAttachment: (data: ApiTypes.Messages.Attachment) => dispatch(Actions.messages.setAttachmentRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)