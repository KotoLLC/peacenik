import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TextareaAutosize from 'react-autosize-textarea'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import { Link } from 'react-router-dom'

export const ContainerStyled = styled(Container)`
  && {
    padding-top: 100px;
    padding-bottom: 40px;
  }  
`

export const PaperStyled = styled(Paper)`
  && {
    padding: 20px 0px;
    margin-bottom: 15px;
  }

  @media (max-width: 600px) {
    padding: 15px 0px;
  }
`

export const CommentsWrapepr = styled.div`
  padding: 0 20px;
`

export const CommentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  width: 100%;
`

export const CreateWrapper = styled.div`
  display: flex;
  padding: 0 20px;

   @media (max-width: 600px) {
    padding: 0 15px;
  }
`

export const EditorWrapper = styled.div`
  width: calc(100% - 60px);
  margin-left: 20px;
`

export const EditorInMessageWrapper = styled.div`
  margin: 0 20px 15px;
`

export const TextareaAutosizeStyled = styled(TextareaAutosize)`
  outline: none;
  resize:none;
  border: none;
  width: 100%;
  padding: 10px 10px;
  border-radius: 0;
  font-family: 'Arial';
  font-size: 14px;
  line-height: 1.5;
  background: transparent;

  &.bordered {
    border-bottom: 1px solid #000;
  }
`

export const EditorButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  padding-right: 40px;
  position: relative;
`

export const ButtonSend = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 0;
`

export const TextareaTitle = styled.p`
  font-size: 14px;
  margin-top: -5px;
  color: grey;
  transition: 0.3s;
  opacity: 1;

  &.active {
    opacity: 0;
  }
`

export const MessageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 10px;

  @media (max-width: 600px) {
    padding-left: 15px;
  }
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`

export const UserNameWrapper = styled.div`
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    span {
      width: 100%;
      margin: 0;
    }
  }
`

export const UserName = styled.span`
  font-weight: bold;
  
  @media (max-width: 600px) {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 130px;
  }
`

export const UserNameLink = styled(Link)`
  font-weight: bold;
  color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 600px) {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 130px;
  }
`

export const MessageDate = styled.span`
  display: inline-block;
  margin-left: 10px;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  margin-left: 10px;
`

export const MessageContent = styled.div`
  font-family: Raleway, Arial;
  font-size: 14px;
  margin: 10px 0;
  padding: 0 20px;
  white-space: pre-wrap;
`

export const CommentContent = styled.pre`
  font-family: Raleway, Arial;
  display: inline-block;
  font-size: 14px;
  margin: 0 0 5px;
  padding: 5px 10px;
  border-radius: 20px;
  background: #ededed;
  max-width: 100%;
  white-space: pre-wrap;
`

export const CommentTextWrapper = styled.div`
  flex-grow: 1;
`

export const CommentReactionsNavWrapper = styled.ul`
  padding-left: 10px;
  list-style-type: none;
  display: flex;
  margin: 0;
`

export const CommentReactionsNav = styled.li`
  margin-right: 10px;

  &:before {
    display: inline-block;
    padding-right: 10px;
    content: '•';
    color: "#ccc";
  }

  &:first-child {
    &:before {
      display: none;
    }
  }
`

export const EditMessageWrapper = styled.div`
  padding: 0 20px;
`

export const EditMessageField = styled.div`
  display: flex;
  flex-grow: 2;
  align-items: flex-end;
  margin-bottom: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: #ededed;
  position: relative;
`

export const CroppedText = styled.p`
  white-space: nowrap;
  overflow: hidden; 
  text-overflow: ellipsis; 
`

export const MessageSticky = styled.div`
  /* position: sticky; */
  /* bottom: 0; */
  /* z-index: 100; */
`

export const EmptyMessage = styled(Paper)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-weight: bold;

  a {
    text-decoration: none;
  }
`

export const EmptyMessageFeed = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const UpButton = styled(IconButton)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
`

export const ReactionsWrapper = styled.div`
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const UploadInput = styled.input`
  display: none;
`

export const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 500px;
  
  @media (max-width: 600px) {
    display: inline-block;
  }
`

export const AttachmentWrapper = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 600px) {
    display: block;
    text-align: center;
  }
`

export const PreloaderWrapper = styled.div`
  position: fixed;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &.bottom {
    bottom: 10px;
    transform: translate(-50%, 0);
  }
`

export const CircularProgressStyled = styled(CircularProgress)`
  && {
    color: #fff;
  }
`

export const AvatarWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`

export const AvatarWrapperLink = styled(Link)`
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`

export const AvatarStyled = styled(Avatar)`
  && {
    margin-right: 10px;
    background: #bdbdbd;
  }
`

export const LikesWrapper = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden; 
  margin: 0;
`

export const LikesNamesList = styled.span`
  display: inline-block;
  margin-left: 10px;
`

export const ReactionNavWrapper = styled.div`
  display: flex;
  padding: 10px;

  @media (max-width: 600px) {
    padding: 0px 10px;
  }
`

export const ReactionNavItem = styled.div`
  width: 50%;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;

  &:hover {
    background-color: #ededed;
  }

  &:last-child {
    margin: 0;
  }
`

export const ReactionNavText = styled.span`
  padding-left: 10px;
  display: inline-block;
  font-weight: bold;
`

export const LikeCommentButton = styled.span`
  cursor: pointer;
`

export const CommentsLink = styled.span`
  display: inline-block;
  cursor: pointer;
  font-weight: bold;
  margin: 0 0 10px 20px;
`

export const BoldText = styled.span`
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  margin-left: 4px;
`

export const ErrorMessage = styled.div`
  font-size: 14px;
  color: red;
  margin-top: 20px;
`

export const TextFieldStyled = styled(TextField)`
  && {
    width: 100%;
  }
` 