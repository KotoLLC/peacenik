import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { connect } from 'react-redux';
import Actions from '@store/actions';
import selectors from '@selectors/index';
import { Player } from 'video-react';
import { ApiTypes, StoreTypes, CommonTypes } from 'src/types';
import { getAvatarUrl } from '@services/avatarUrl';
import { TimeBlock, AccessTimeIconStyled } from '@view/shared/styles';
import commentIconContained from '@assets/images/comment-icon-contained.svg';
import likeIconContained from '@assets/images/like-icon-contained.svg';
import { MentionsInput, Mention } from 'react-mentions';
import {
  friendsToMentionFriends,
  MentionFriend,
} from '@services/dataTransforms/friendsToMentionFriends';
import { LinkRenderer } from '@view/shared/LinkRenderer';
import { YoutubeFrame } from './YoutubeFrame';
import { AuthorButtonsMenu } from './AuthorButtonsMenu';
import { NoAuthorButtonsMenu } from './NoAuthorButtonsMenu';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import loadImage from 'blueimp-load-image';
import ClearIcon from '@material-ui/icons/Clear';
import FeedComment from './FeedComment';
import { getUserNameByUserId } from '@services/userNames';
import {
  FeedWrapper,
  FeedHeader,
  UserInfo,
  AvatarWrapperLink,
  AvatarStyled,
  UserNameLink,
  FeedText,
  FeedAttachmentWrapper,
  ActionCountersWrapper,
  ActionCounterIcon,
  ActionCounter,
  ImagePreview,
  FeedFooter,
  ReactionNawWrapper,
  ReactionNavItem,
  EditorContentWrapper,
  MentionsInputWrapper,
  EditorButtonsWrapper,
  AttachmentButton,
  UploadInput,
  ButtonSend,
  AttachmentWrapper,
  DeleteAttachmentButton,
} from './styles';

interface Props extends ApiTypes.Feed.Message {
  isAuthor: boolean;
  uploadLink: ApiTypes.UploadLink | null;
  currentHub: CommonTypes.HubTypes.CurrentHub;
  currentMessageLikes: ApiTypes.Feed.LikesInfoData | null;
  isCommentsOpenByDeafult?: boolean;
  friends: ApiTypes.Friends.Friend[] | null;

  showCommentPopup: any;

  onMessageEdit: (data: ApiTypes.Feed.EditMessage) => void;
  onCommentPost: (data: ApiTypes.Feed.PostComment) => void;
  onGetMessageUploadLink: (data: ApiTypes.Feed.UploadLinkRequest) => void;
  onSetAttachment: (data: ApiTypes.Feed.Attachment) => void;
  onResetMessageUploadLink: () => void;
  onLikeMessage: (data: ApiTypes.Feed.Like) => void;
  getLikesForMessage: (data: ApiTypes.Feed.Like) => void;
  callback?: () => void;
}

const FeedPost: React.FC<Props> = React.memo((props) => {
  const {
    text,
    user_name,
    user_full_name,
    created_at,
    isAuthor,
    id,
    sourceHost,
    messageToken,
    comments,
    attachment,
    attachment_type,
    uploadLink,
    onResetMessageUploadLink,
    onLikeMessage,
    likes,
    liked_by_me,
    user_id,
    callback,
    friends,
    showCommentPopup,
  } = props;

  const [isEditer, setEditor] = useState<boolean>(false);
  const [message, onMessageChange] = useState<string>(text);
  const [isFileUploaded, setUploadedFile] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAttacmentDeleted, onAttachmentDelete] = useState<boolean>(false);
  const [mentionFriends, setMentionFriends] = useState<MentionFriend[]>([]);
  const userName = user_full_name || user_name;

  /*  READ VIEW  */

  const renderReactions = () => {
    return (
      <ActionCountersWrapper>
        <ActionCounter>
          <ActionCounterIcon src={likeIconContained} />
          <b>{likes || 0}</b> likes
        </ActionCounter>
        <ActionCounter>
          <ActionCounterIcon src={commentIconContained} />
          <b>{comments?.length || 0}</b> comments
        </ActionCounter>
      </ActionCountersWrapper>
    );
  };

  const renderReactionNav = () => {
    return (
      <ReactionNawWrapper>
        <ReactionNavItem
          onClick={() => {
            if (liked_by_me) {
              onLikeMessage({ host: sourceHost, id: id, unlike: true });
            } else {
              onLikeMessage({ host: sourceHost, id: id });
            }
          }}
        >
          <IconButton>
            {liked_by_me ? (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M16.0077 4C14.1144 4 12.9291 4.77191 11.9856 6C10.9869 4.75271 9.88251 4 8.01922 4C5.17209 4.00472 2.31913 6.13431 2.00633 9C2.00491 9.19919 1.94411 9.88212 2.2307 10.9956C2.64509 12.6019 3.96243 14.1768 5.3564 15.3333L12.0135 21L18.6705 15.3333C20.0645 14.1759 21.3818 12.6019 21.7962 10.9956C22.0828 9.88212 21.9889 9.19919 21.9712 9C21.6744 6.13197 18.8505 4 16.0077 4Z'
                  fill='#DB391F'
                />
              </svg>
            ) : (
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M11.5953 6.3125L11.9937 6.81013L12.3821 6.30462C12.8229 5.7308 13.3035 5.28529 13.8754 4.98083C14.4451 4.6776 15.1322 4.5 16.0077 4.5C18.6414 4.5 21.2061 6.48185 21.4735 9.04844C21.4745 9.0597 21.4758 9.07251 21.4772 9.08687C21.4995 9.31078 21.5593 9.91022 21.312 10.871C20.9359 12.3283 19.7121 13.8186 18.3511 14.9486L18.3511 14.9486L18.3464 14.9526L12.0135 20.3434L5.68049 14.9526L5.68052 14.9526L5.67565 14.9485C4.31481 13.8195 3.09084 12.3282 2.71484 10.8707C2.47748 9.94831 2.49588 9.35698 2.50419 9.09031C2.50486 9.0688 2.50546 9.0494 2.50586 9.03211C2.79831 6.47767 5.38476 4.50457 8.01964 4.5C8.87959 4.50006 9.53731 4.67269 10.0881 4.97169C10.6435 5.27318 11.1206 5.7196 11.5953 6.3125Z'
                  stroke='#A1AEC8'
                />
              </svg>
            )}
          </IconButton>
          <b>{likes || 0}</b> likes
        </ReactionNavItem>
        <FeedComment
          user_name={userName}
          showCommentPopup={showCommentPopup}
          {...{
            user_id,
            created_at,
            message,
            isAttacmentDeleted,
            attachment,
            attachment_type,
            comments,
            sourceHost,
            id,
            friends,
            messageToken,
          }}
        />
      </ReactionNawWrapper>
    );
  };

  const renderViewAttachment = () => {
    if (isAttacmentDeleted) {
      return null;
    }

    if (attachment_type && attachment_type.indexOf('image') !== -1) {
      return <a data-fancybox="gallery" href={attachment}><ImagePreview src={attachment} /></a>;
    }

    if (attachment_type && attachment_type.indexOf('video') !== -1) {
      return (
        <a data-fancybox="gallery" href={attachment}>
          <Player>
            <source src={attachment} />
          </Player>
        </a>
      );
    }

    return null;
  };

  const renderReadView = () => (
    <>
      <FeedText className='markdown-body'>
        <ReactMarkdown escapeHtml={true} renderers={{ link: LinkRenderer }}>
          {message}
        </ReactMarkdown>
      </FeedText>
      <FeedAttachmentWrapper>
        <YoutubeFrame text={message} />
        {renderViewAttachment()}
      </FeedAttachmentWrapper>
      <FeedFooter>
        {renderReactionNav()}
        {isAuthor ? (
          <AuthorButtonsMenu
            {...{ isEditer, setEditor, message, id, sourceHost }}
          />
        ) : (
          <NoAuthorButtonsMenu {...{ message, id, sourceHost }} />
        )}
      </FeedFooter>
    </>
  );

  /*  EDIT VIEW  */
  const onMessageSave = () => {
    let attachment_changed = file?.size ? true : false;
    let attachment_id = file?.size ? uploadLink?.blob_id : '';

    if (isAttacmentDeleted) {
      attachment_changed = true;
      attachment_id = '';
    }

    props.onMessageEdit({
      host: sourceHost,
      body: {
        message_id: id,
        text: message,
        text_changed: true,
        attachment_changed,
        attachment_id,
      },
    });
    setEditor(false);
    onResetMessageUploadLink();
  };

  const onComandEnterDownInMessage = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onMessageSave();
    }
  };

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { onGetMessageUploadLink } = props;
    setUploadedFile(false);
    onAttachmentDelete(false);

    const uploadedFile = event.target.files;
    if (uploadedFile && uploadedFile[0]) {
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
    onAttachmentDelete(true);
    setFile(null);
  };

  const renderEditAttachment = () => {
    if (isAttacmentDeleted) {
      return null;
    }

    if (file?.size && file?.type.indexOf('image') !== -1) {
      return (
        <AttachmentWrapper>
          <ImagePreview src={URL.createObjectURL(file)} />
          <DeleteAttachmentButton onClick={onFileDelete}>
            <ClearIcon fontSize='small' />
          </DeleteAttachmentButton>
        </AttachmentWrapper>
      );
    }

    if (file?.name && file?.type.indexOf('video') !== -1) {
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

    if (attachment_type && attachment_type.indexOf('image') !== -1) {
      return (
        <AttachmentWrapper>
          <ImagePreview src={attachment} />
          <DeleteAttachmentButton onClick={onFileDelete}>
            <ClearIcon fontSize='small' />
          </DeleteAttachmentButton>
        </AttachmentWrapper>
      );
    }

    if (attachment_type && attachment_type.indexOf('video') !== -1) {
      return (
        <AttachmentWrapper>
          <Player>
            <source src={attachment} />
          </Player>
          <DeleteAttachmentButton onClick={onFileDelete}>
            <ClearIcon fontSize='small' />
          </DeleteAttachmentButton>
        </AttachmentWrapper>
      );
    }

    return null;
  };

  const renderEditView = () => (
    <>
      <EditorContentWrapper>
        <MentionsInputWrapper>
          <MentionsInput
            className='mentions'
            placeholder='What’s new?'
            value={message}
            onChange={(evant) => onMessageChange(evant.target.value)}
            onKeyDown={onComandEnterDownInMessage}
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

      {renderEditAttachment()}

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
        <ButtonSend type='submit' onClick={onMessageSave}>
          <SendIcon />
        </ButtonSend>
      </EditorButtonsWrapper>
    </>
  );

  /*  BOTH VIEWS  */

  useEffect(() => {
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

    callback && callback();
  }, [props, file, isFileUploaded, id, callback, friends]);

  return (
    <FeedWrapper>
      {/* HEADER */}
      <FeedHeader>
        <UserInfo>
          <AvatarWrapperLink to={`/profile/user?id=${user_id}`}>
            <AvatarStyled src={getAvatarUrl(user_id)} alt={user_name} />
          </AvatarWrapperLink>
          <UserNameLink to={`/profile/user?id=${user_id}`}>
            {getUserNameByUserId(user_id)}
          </UserNameLink>
        </UserInfo>
        <TimeBlock>
          {moment(created_at).fromNow()}
          <AccessTimeIconStyled />
        </TimeBlock>
      </FeedHeader>

      {isEditer ? renderEditView() : renderReadView()}
    </FeedWrapper>
  );
});

type StateProps = Pick<
  Props,
  'uploadLink' | 'currentHub' | 'currentMessageLikes' | 'friends'
>;
const mapStateToProps = (state: StoreTypes): StateProps => ({
  uploadLink: state.feed.uploadLink,
  currentHub: selectors.feed.currentHub(state),
  currentMessageLikes: selectors.feed.currentMessageLikes(state),
  friends: selectors.friends.friends(state),
});

type DispatchProps = Pick<
  Props,
  | 'onMessageEdit'
  | 'onCommentPost'
  | 'onGetMessageUploadLink'
  | 'onSetAttachment'
  | 'onResetMessageUploadLink'
  | 'onLikeMessage'
  | 'getLikesForMessage'
>;
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onMessageEdit: (data: ApiTypes.Feed.EditMessage) =>
    dispatch(Actions.feed.editFeedMessageRequest(data)),
  onCommentPost: (data: ApiTypes.Feed.PostComment) =>
    dispatch(Actions.feed.postFeedCommentRequest(data)),
  onGetMessageUploadLink: (data: ApiTypes.Feed.UploadLinkRequest) =>
    dispatch(Actions.feed.getFeedMessageUploadLinkRequest(data)),
  onSetAttachment: (data: ApiTypes.Feed.Attachment) =>
    dispatch(Actions.feed.setAttachmentRequest(data)),
  onResetMessageUploadLink: () =>
    dispatch(Actions.feed.getFeedMessageUploadLinkSucces(null)),
  onLikeMessage: (data: ApiTypes.Feed.Like) =>
    dispatch(Actions.feed.linkFeedMessageRequest(data)),
  getLikesForMessage: (data: ApiTypes.Feed.Like) =>
    dispatch(Actions.feed.getLikesForFeedMessageRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPost);
