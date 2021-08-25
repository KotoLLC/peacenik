import React, { useState, useEffect, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import Actions from '@store/actions';
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types';
import selectors from '@selectors/index';
import ClearIcon from '@material-ui/icons/Clear';
import { Player } from 'video-react';
import { getAvatarUrl } from '@services/avatarUrl';
import Avatar from '@material-ui/core/Avatar';
import loadImage from 'blueimp-load-image';
import SendIcon from '@material-ui/icons/Send';
import queryString from 'query-string';
import { urlify } from '@services/urlify';
import { MentionsInput, Mention } from 'react-mentions';
import {
  friendsToMentionFriends,
  MentionFriend,
} from '@services/dataTransforms/friendsToMentionFriends';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import {
  EditorBlockWrapper,
  EditorButtonsWrapper,
  ButtonSend,
  UploadInput,
  AttachmentButton,
  EditorContentWrapper,
  AvatarWrapper,
  ImagePreview,
  MentionsInputWrapper,
  DeleteAttachmentButton,
  AttachmentWrapper,
  ErrorMessage,
} from './styles';

interface Props {
  authToken: string;
  currentHub: CommonTypes.HubTypes.CurrentHub;
  isFeedMessagePostedSuccess: boolean;
  uploadLink: ApiTypes.UploadLink | null;
  userId: string;
  friends: ApiTypes.Friends.Friend[] | null;
  groupMessageToken: CommonTypes.GroupTypes.GroupMsgToken;

  onMessagePost: (data: ApiTypes.Feed.PostMessage) => void;
  onPostMessageSucces: (value: boolean) => void;
  onGetMessageUploadLink: (data: ApiTypes.Feed.UploadLinkRequest) => void;
  onSetAttachment: (data: ApiTypes.Feed.Attachment) => void;
}

export const Editor: React.FC<Props> = (props) => {
  const [value, onValueChange] = useState<string>('');
  const [isFileUploaded, setUploadedFile] = useState<boolean>(false);
  const [isHubsEmptyMessageShowed, showHubsEmptyMessage] = useState<boolean>(
    false
  );
  const [file, setFile] = useState<File | null>(null);
  const [mentionFriends, setMentionFriends] = useState<MentionFriend[]>([]);
  const {
    isFeedMessagePostedSuccess,
    onPostMessageSucces,
    uploadLink,
    friends,
    groupMessageToken,
  } = props;

  const pathName = window.location.pathname;
  const isGroupMsgPage = pathName.indexOf('group') !== -1 ? true : false;
  const parsed = queryString.parse(window.location.search);
  let group_id: string = parsed?.id as string;

  const onMessageSend = () => {
    if (!props.currentHub.host && !isGroupMsgPage) {
      showHubsEmptyMessage(true);
      return false;
    }

    if (value || file) {
      const data = {
        host: isGroupMsgPage ? groupMessageToken.host : props.currentHub.host,
        body: {
          token: isGroupMsgPage
            ? groupMessageToken.token
            : props.currentHub.token,
          text: urlify(value),
          attachment_id: uploadLink?.blob_id,
          group_id: isGroupMsgPage ? group_id : undefined,
        },
      };
      setFile(null);
      props.onMessagePost(data);
    }
  };

  const onComandEnterDown = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onMessageSend();
    }
  };

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetMessageUploadLink } = props;
    setUploadedFile(false);

    const uploadedFile = event.target.files;
    if (uploadedFile && uploadedFile[0] && props.currentHub.host) {
      onGetMessageUploadLink({
        host: props.currentHub.host,
        content_type: uploadedFile[0].type,
        file_name: uploadedFile[0].name,
      });

      /* tslint:disable */
      loadImage(
        uploadedFile[0],
        function (img, data) {
          if (data.imageHead && data.exif) {
            // Reset Exif Orientation data:
            loadImage.writeExifData(data.imageHead, data, 'Orientation', 1);
            img.toBlob(function (blob) {
              loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
                setFile(newBlob);
              });
            }, 'image/jpeg');
          } else {
            setFile(uploadedFile[0]);
          }
        },
        { meta: true, orientation: true, canvas: true }
      );
      /* tslint:enable */
    }
  };

  const onFileDelete = () => {
    setFile(null);
  };

  useEffect(() => {
    if (isFeedMessagePostedSuccess) {
      onValueChange('');
    }

    onPostMessageSucces(false);

    if (props.uploadLink && file && !isFileUploaded) {
      const { form_data } = props?.uploadLink;
      const data = new FormData();

      for (let key in form_data) {
        data.append(key, form_data[key]);
      }

      data.append('file', file, file?.name);

      props.onSetAttachment({
        link: props?.uploadLink.link,
        form_data: data,
      });
    }

    if (!mentionFriends?.length && friends?.length) {
      setMentionFriends(friendsToMentionFriends(friends));
    }
  }, [
    isFeedMessagePostedSuccess,
    uploadLink,
    file,
    isFileUploaded,
    onPostMessageSucces,
    props,
    friends,
    mentionFriends
  ]);

  const renderAttachment = () => {
    if (file && file?.type.indexOf('image') !== -1) {
      return (
        <AttachmentWrapper>
          <ImagePreview src={URL.createObjectURL(file)} />
          <DeleteAttachmentButton onClick={onFileDelete}>
            <ClearIcon fontSize='small' />
          </DeleteAttachmentButton>
        </AttachmentWrapper>
      );
    }

    if (file && file?.type.indexOf('video') !== -1) {
      return (
        <AttachmentWrapper>
          <Player>
            <source src={URL.createObjectURL(file)} />
          </Player>
          <DeleteAttachmentButton onClick={onFileDelete}>
            <ClearIcon fontSize='small' />
          </DeleteAttachmentButton>
        </AttachmentWrapper>
      );
    }

    return null;
  };

  return (
    <EditorBlockWrapper>
      <EditorContentWrapper>
        <AvatarWrapper className='small'>
          <Avatar src={getAvatarUrl(props.userId)} />
        </AvatarWrapper>
        <MentionsInputWrapper>
          <MentionsInput
            className='mentions'
            value={value}
            placeholder='What’s new?'
            onChange={(evant) => onValueChange(evant.target.value)}
            onKeyDown={onComandEnterDown}
          >
            <Mention
              trigger='@'
              data={mentionFriends}
              className={'mentions__mention'}
              markup='[@__display__](/profile/user?id=__id__)'
            />
          </MentionsInput>
        </MentionsInputWrapper>
      </EditorContentWrapper>

      {renderAttachment()}

      {isHubsEmptyMessageShowed ? (
        <ErrorMessage>
          You cannot post messages until you are friends with someone who has
          their own node. Alternatively, you can start a node yourself.
        </ErrorMessage>
      ) : (
        <EditorButtonsWrapper>
          <AttachmentButton>
            <CameraAltOutlinedIcon />
            <UploadInput
              type='file'
              id='file'
              name='file'
              onChange={onFileUpload}
              accept='video/*,image/*'
            />
          </AttachmentButton>
          <ButtonSend type='submit' onClick={onMessageSend}>
            <SendIcon />
          </ButtonSend>
        </EditorButtonsWrapper>
      )}
    </EditorBlockWrapper>
  );
};

type StateProps = Pick<
  Props,
  | 'authToken'
  | 'currentHub'
  | 'isFeedMessagePostedSuccess'
  | 'uploadLink'
  | 'userId'
  | 'friends'
  | 'groupMessageToken'
>;
const mapStateToProps = (state: StoreTypes): StateProps => ({
  authToken: state.authorization.authToken,
  currentHub: selectors.feed.currentHub(state),
  isFeedMessagePostedSuccess: selectors.feed.isFeedMessagePostedSuccess(state),
  uploadLink: state.feed.uploadLink,
  userId: selectors.profile.userId(state),
  friends: selectors.friends.friends(state),
  groupMessageToken: selectors.groups.groupMessageToken(state),
});

type DispatchProps = Pick<
  Props,
  | 'onMessagePost'
  | 'onPostMessageSucces'
  | 'onGetMessageUploadLink'
  | 'onSetAttachment'
>;
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessagePost: (data: ApiTypes.Feed.PostMessage) =>
    dispatch(Actions.feed.postFeedMessageRequest(data)),
  onPostMessageSucces: (value: boolean) =>
    dispatch(Actions.feed.postFeedMessageSucces(value)),
  onGetMessageUploadLink: (data: ApiTypes.Feed.UploadLinkRequest) =>
    dispatch(Actions.feed.getFeedMessageUploadLinkRequest(data)),
  onSetAttachment: (data: ApiTypes.Feed.Attachment) =>
    dispatch(Actions.feed.setAttachmentRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
