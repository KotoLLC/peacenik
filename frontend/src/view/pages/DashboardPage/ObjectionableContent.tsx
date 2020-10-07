import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import DeleteIcon from '@material-ui/icons/Delete'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'
import Avatar from '@material-ui/core/Avatar'
import { getAvatarUrl } from '@services/avatarUrl'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'
import { Player } from 'video-react'
import {
  DashboardSection,
  Header,
  Title,
  ContentWrapper,
  ButtonsWrapper,
  ButtonStyled,
  ResolveButton,
  ReportText,
  ReportTitle,
} from './styles'

import {
  UserInfo,
  AvatarWrapper,
  UserNameWrapper,
  UserName,
  MessageDate,
  MessageContent,
  AttachmentWrapper,
  ImagePreview,
} from '@view/pages/MessagesPage/styles'

interface Props {
  objectionableContent: ApiTypes.Dashboard.ObjectionableContent[],
  ownedHubs: string[]

  onGetObjectionableContent: () => void
}

export const ObjectionableContent: React.FC<Props> = (props) => {
  const { ownedHubs, objectionableContent } = props
  const { onGetObjectionableContent } = props

  const renderAttachment = (attachment_type: string, attachment: string) => {

    if (attachment_type && attachment_type.indexOf('image') !== -1) {
      return (
        <AttachmentWrapper>
          <ImagePreview src={attachment} />
        </AttachmentWrapper>
      )
    }

    if (attachment_type && attachment_type.indexOf('video') !== -1) {
      return (
        <AttachmentWrapper>
          <Player>
            <source src={attachment} />
          </Player>
        </AttachmentWrapper>
      )
    }

    return null
  }

  useEffect(() => {
    onGetObjectionableContent()
  }, [ownedHubs, onGetObjectionableContent])

  return (
    <DashboardSection>
      <Header>
        <Title>Objectionable content</Title>
      </Header>
      {Boolean(objectionableContent.length) && objectionableContent.map(item => (
        <ContentWrapper key={item.id} className={item.resolved_at ? '' : 'unresolved'}>
          <ReportTitle>Report from:</ReportTitle>
          <UserInfo>
            <AvatarWrapper>
              <Avatar src={getAvatarUrl(item.reporter_id)} />
            </AvatarWrapper>
            <UserNameWrapper>
              <UserName>{item.reporter_name}</UserName>
              <MessageDate>{moment(item.created_at).fromNow()}</MessageDate>
            </UserNameWrapper>
          </UserInfo>
          <ReportText>Message: <span>{item.report}</span></ReportText>
          <ReportTitle>Content:</ReportTitle>
          <UserInfo>
            <AvatarWrapper>
              <Avatar src={getAvatarUrl(item.author_id)} />
            </AvatarWrapper>
            <UserNameWrapper>
              <UserName>{item.author_name}</UserName>
            </UserNameWrapper>
          </UserInfo>
          <MessageContent className="markdown-body">
            <ReactMarkdown>{item.text}</ReactMarkdown>
          </MessageContent>
          {renderAttachment(item.attachment_type, item.attachment)}
          <ButtonsWrapper>
            <ButtonStyled
              variant="contained"
              color="primary"
            >Delete</ButtonStyled>
            <ButtonStyled
              variant="contained"
              color="secondary"
            >Eject</ButtonStyled>
            <ResolveButton
              variant="contained"
              color="secondary"
            >Resolve</ResolveButton>
          </ButtonsWrapper>
        </ContentWrapper>
      ))}
    </DashboardSection>
  )
}

type StateProps = Pick<Props, 'objectionableContent' | 'ownedHubs'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  objectionableContent: selectors.dashboard.objectionableContent(state),
  ownedHubs: selectors.profile.ownedHubs(state),
})

type DispatchProps = Pick<Props, 'onGetObjectionableContent'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetObjectionableContent: () => dispatch(Actions.dashboard.getMessageReportsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ObjectionableContent)
