import React, { useCallback, useState, useEffect } from "react"
import {
  createStyles,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Theme,
} from "@material-ui/core"
import SendIcon from "@material-ui/icons/Send"
import PhotoCameraOutlinedIcon from "@material-ui/icons/PhotoCameraOutlined"
import { AttachmentButton, DMInFooterWrapper } from "../styles"
import { Visibility } from "@material-ui/icons"
import { UploadInput } from "@view/shared/styles"
import { ChangeEvent } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { CommonTypes, ApiTypes, StoreTypes } from "src/types"
import Actions from "@store/actions"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 0,
      background: "#fff",
      borderWidth: 0,
      marginRight: "15px",
      "& .MuiOutlinedInput-input": {
        padding: "0px 14px",
      },
    },
    button: {
      color: "#fff",
    },
    notchedOutline: {
      borderWidth: "0px",
      borderColor: "#43619d !important",
    },
  })
)
const DirectMessageFooter = ({location}) => {
  const [msgValue, setMsgValue] = useState("")
  const msgInputStyles = useStyles()
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false)
  // const [uploadImg, setUploadImg] = useState<FileList|null>(null)
  const tokenData: CommonTypes.TokenData = useSelector((state: StoreTypes) => state.messages.directPostToken)
  const postDirectMsgStatus: boolean = useSelector( (state: StoreTypes) => state.messages.directMsgSent)
  const uploadLink: ApiTypes.UploadLink | null = useSelector( (state: StoreTypes) => state.messages.uploadLink)
  
  const [uploadImg, setUploadImg] = useState<FileList|null>(null)

  const feedsTokens = useSelector( (state: StoreTypes) => state.feed.feedsTokens )
  const dispatch = useDispatch()
  // onGetMessageUploadLink: (data: ApiTypes.Feed.UploadLinkRequest) => dispatch(Actions.feed.getFeedMessageUploadLinkRequest(data))
  const handleImageFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const onGetUploadLink = (value: ApiTypes.UploadLinkRequestWithHost) =>
      dispatch(Actions.messages.getUploadLinkRequest(value))

    setIsFileUploaded(false)

    let tempUploadImg = event.target.files

    setUploadImg(tempUploadImg)

    if (tempUploadImg && tempUploadImg[0] && (tokenData.host !== "")) {
      let getMsgToken = ""
      feedsTokens.map( (item) => {
        if ( item.host === tokenData.host)
          getMsgToken = item.token
      })
      if ( getMsgToken !== "") {
        onGetUploadLink({
          host: tokenData.host, 
          content_type: tempUploadImg[0].type,
          file_name: tempUploadImg[0].name,
        })
        setMsgValue(tempUploadImg[0].name)
      }
    }
  }

  if ( postDirectMsgStatus ){
    setMsgValue("")
    dispatch(Actions.messages.setPostMsgToFriendSuccess(false))
  }

  const sendMsg = () => {
    if ( location.pathname?.indexOf("messages/d/") > -1){
      let friend_id = location.pathname?.substring(location.pathname?.lastIndexOf('/') + 1)
      if ( friend_id !== ""){
        let getMsgToken = ""
        feedsTokens.map( (item) => {
          if ( item.host === tokenData.host)
            getMsgToken = item.token
        })
        let data: ApiTypes.Feed.PostMessage = {
          host: tokenData.host,
          body: {
            token: tokenData.token,
            text:msgValue,
            attachment_id: uploadLink?.blob_id,
            friend_id: friend_id,
            msg_token: getMsgToken
          }
        }
        dispatch(Actions.messages.sendMessageToFriend(data))
      }
    }
  }
  
  if (uploadLink && uploadImg) {
    const { form_data } = uploadLink;
    const data = new FormData();

    for (let key in form_data) {
      data.append(key, form_data[key]);
    }

    data.append('file', uploadImg[0], uploadImg[0]?.name);

    dispatch(Actions.feed.setAttachmentRequest({
      link: uploadLink.link,
      form_data: data
    }))
  }

  // useEffect( () => {

  // }, [])
  
  const onComandEnterDown = (event) => {
    if (event.keyCode === 13) {
      sendMsg();
    }
  };

  return (
    <DMInFooterWrapper>
      <OutlinedInput
        classes={{
          root: msgInputStyles.root,
          notchedOutline: msgInputStyles.notchedOutline,
        }}
        type="text"
        placeholder="Write something"
        value={msgValue}
        style={{ 
          flex: "1 0 auto", 
          width: "calc(-48px)"
        }}
        onChange={(e) => setMsgValue(e.target.value)}
        onKeyDown={onComandEnterDown}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility">
              <AttachmentButton>
                <PhotoCameraOutlinedIcon />
                <UploadInput
                  type="file"
                  name="attached_image"
                  onChange={handleImageFileUpload}
                  accept="image/x-png,image/gif,image/jpeg"
                />
              </AttachmentButton>
            </IconButton>
          </InputAdornment>
        }
      />
      <IconButton
        className={msgInputStyles.button}
        aria-label="upload picture"
        component="span"
        onClick={sendMsg}
      >
        <SendIcon />
      </IconButton>
    </DMInFooterWrapper>
  )
}

export default DirectMessageFooter
