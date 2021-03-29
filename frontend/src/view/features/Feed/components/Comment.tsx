import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { connect } from 'react-redux';
import Actions from '@store/actions';
import selectors from '@selectors/index';
import SendIcon from '@material-ui/icons/Send';
import { getAvatarUrl } from '@services/avatarUrl';
import { AuthorButtonsMenu } from './AuthorButtonsMenu';
import { NoAuthorButtonsMenu } from './NoAuthorButtonsMenu';
import { ApiTypes, StoreTypes } from 'src/types';
import { LinkRenderer } from '@view/shared/LinkRenderer';
import ReactMarkdown from 'react-markdown';
import Avatar from '@material-ui/core/Avatar';
import { MentionsInput, Mention } from 'react-mentions';
import {
  friendsToMentionFriends,
  MentionFriend,
} from '@services/dataTransforms/friendsToMentionFriends';
import { TimeBlock, AccessTimeIconStyled } from '@view/shared/styles';
import { getUserNameByUserId } from '@services/userNames';
import {
  CommentWrapper,
  UserNameLink,
  CommentTextWrapper,
  AvatarWrapper,
  CircularProgressStyled,
  CommentContent,
  CommentReactionsNavWrapper,
  LikeCommentButton,
  UserInfo,
  FeedHeader,
  AvatarWrapperLink,
  ReactionNawWrapper,
  ReactionNavItem,
  ReactionCounter,
  EditorContentWrapper,
  MentionsInputWrapper,
  EditorButtonsWrapper,
  ButtonSend,
} from './styles';

interface Props extends ApiTypes.Feed.Comment {
  userId: string;
  currentCommentLikes: ApiTypes.Feed.LikesInfoData | null;
  friends: ApiTypes.Friends.Friend[] | null;

  onCommentEdit: (data: ApiTypes.Feed.EditComment) => void;
  onCommentDelete: (data: ApiTypes.Feed.DeleteComment) => void;
  onLikeComment: (data: ApiTypes.Feed.Like) => void;
  getLikesForComment: (data: ApiTypes.Feed.Like) => void;
}

const Comment: React.SFC<Props> = (props) => {
  const {
    text,
    user_name,
    user_full_name,
    created_at,
    id,
    user_id,
    sourceHost,
    userId,
    liked_by_me,
    likes,
    onLikeComment,
    currentCommentLikes,
    getLikesForComment,
    friends,
  } = props;
  const [isEditer, setEditor] = useState<boolean>(false);
  const [comment, onCommentChange] = useState<string>(text);
  const commentRef = React.createRef<HTMLDivElement>();
  const [isLikesInfoRequested, setLikesInfoRequest] = useState<boolean>(false);
  const [mentionFriends, setMentionFriends] = useState<MentionFriend[]>([]);

  useEffect(() => {
    if (currentCommentLikes?.id === id) {
      setLikesInfoRequest(false);
    }
    if (!mentionFriends?.length && friends?.length) {
      setMentionFriends(friendsToMentionFriends(friends));
    }
  }, [currentCommentLikes, id, friends]);

  const onMessageSave = () => {
    setEditor(false);
    props.onCommentEdit({
      host: sourceHost,
      body: {
        comment_id: id,
        text: comment,
        text_changed: true,
      },
    });
  };

  const onComandEnterDown = (event) => {
    if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
      onMessageSave();
    }
  };

  const getLikesInfo = () => {
    if (currentCommentLikes?.id === id) {
      setLikesInfoRequest(false);
    }

    if (currentCommentLikes?.id !== id) {
      setLikesInfoRequest(true);
      getLikesForComment({
        host: sourceHost,
        id: id,
      });
    }
  };

  const rendreLikeButton = () => {
    let likesInfo = 'No likes yet';
    let usersLikes = '';

    if (currentCommentLikes?.id === id) {
      currentCommentLikes.likes.length &&
        currentCommentLikes.likes.forEach((item, counter) => {
          if (counter < 15) {
            const likedUserName = item.user_full_name || item.user_name;
            const comma =
              currentCommentLikes?.likes.length - 1 === counter ? '' : ', ';
            usersLikes += `${likedUserName}${comma}`;
          }

          if (counter === 15) {
            usersLikes += `...`;
          }
        });
    }

    return (
      <Tooltip
        onClick={() => {
          if (liked_by_me) {
            onLikeComment({ host: sourceHost, id: id, unlike: true });
          } else {
            onLikeComment({ host: sourceHost, id: id });
          }
        }}
        title={
          isLikesInfoRequested ? (
            <CircularProgressStyled size={30} />
          ) : (
            <>{usersLikes || likesInfo}</>
          )
        }
        interactive
        onOpen={() => getLikesInfo()}
      >
        <LikeCommentButton>{likes} like</LikeCommentButton>
      </Tooltip>
    );
  };

  const renderReactionNav = () => {
    return (
      <ReactionNawWrapper>
        <ReactionNavItem
          onClick={() => {
            if (liked_by_me) {
              onLikeComment({ host: sourceHost, id: id, unlike: true });
            } else {
              onLikeComment({ host: sourceHost, id: id });
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
          <ReactionCounter>
            <b>{likes}</b> Likes
          </ReactionCounter>
        </ReactionNavItem>
      </ReactionNawWrapper>
    );
  };

  const renderCurrentIcons = () => {
    return userId === user_id ? (
      <AuthorButtonsMenu
        {...{ message: comment, id, sourceHost, setEditor, isEditer }}
      />
    ) : (
      <NoAuthorButtonsMenu {...{ message: comment, id, sourceHost }} />
    );
  };

  const renderRaedView = () => {
    return (
      <>
        <CommentTextWrapper>
          <CommentContent className='markdown-body'>
            <ReactMarkdown renderers={{ link: LinkRenderer }}>
              {comment}
            </ReactMarkdown>
          </CommentContent>
        </CommentTextWrapper>
        <CommentReactionsNavWrapper>
          {renderReactionNav()}
          {renderCurrentIcons()}
        </CommentReactionsNavWrapper>
      </>
    );
  };

  const renderEditView = () => {
    return (
      <>
        <EditorContentWrapper className='comments'>
          <MentionsInputWrapper>
            <MentionsInput
              className='mentions'
              value={comment}
              placeholder='Write your comment…'
              onChange={(evant) => onCommentChange(evant.target.value)}
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
        <EditorButtonsWrapper className='comments'>
          <span />
          <ButtonSend className='small' type='submit' onClick={onMessageSave}>
            <SendIcon />
          </ButtonSend>
        </EditorButtonsWrapper>
      </>
    );
  };

  return (
    <CommentWrapper
      ref={commentRef}
      className={isEditer ? 'no-bottom-line' : ''}
    >
      <FeedHeader>
        <UserInfo>
          <AvatarWrapperLink
            className='small'
            to={`/profile/user?id=${user_id}`}
          >
            <AvatarWrapper className='small'>
              <Avatar
                src={getAvatarUrl(user_id)}
                alt={getUserNameByUserId(user_id)}
              />
            </AvatarWrapper>
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
      {isEditer ? renderEditView() : renderRaedView()}
    </CommentWrapper>
  );
};

type StateProps = Pick<Props, 'userId' | 'currentCommentLikes' | 'friends'>;
const mapStateToProps = (state: StoreTypes): StateProps => ({
  userId: selectors.profile.userId(state),
  currentCommentLikes: selectors.feed.currentCommentLikes(state),
  friends: selectors.friends.friends(state),
});

type DispatchProps = Pick<
  Props,
  'onCommentEdit' | 'onCommentDelete' | 'onLikeComment' | 'getLikesForComment'
>;
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onCommentEdit: (data: ApiTypes.Feed.EditComment) =>
    dispatch(Actions.feed.editFeedCommentRequest(data)),
  onCommentDelete: (data: ApiTypes.Feed.DeleteComment) =>
    dispatch(Actions.feed.deleteCommentRequest(data)),
  onLikeComment: (data: ApiTypes.Feed.Like) =>
    dispatch(Actions.feed.linkFeedCommnetRequest(data)),
  getLikesForComment: (data: ApiTypes.Feed.Like) =>
    dispatch(Actions.feed.getLikesForFeedCommentRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
