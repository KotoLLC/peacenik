import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import { ApiTypes, StoreTypes } from 'src/types'
import selectors from '@selectors/index'
import Avatar from '@material-ui/core/Avatar'
import { getAvatarUrl } from '@services/avatarUrl'
import ReactMarkdown from 'react-markdown'
import moment from 'moment'
import { Player } from 'video-react'
import DeleteComplainContentDialog from './DeleteComplainContentDialog'
import UserEjectDialog from './UserEjectDialog'
import {
  DashboardSection,
  Header,
  Title,
  ContentWrapper,
  ButtonsWrapper,
  ResolveButton,
  ReportText,
  ReportTitle,
  MessageContent,
  UserInfo,
  AvatarWrapper, 
  UserNameWrapper,
  UserName,
  MessageDate,
  AttachmentWrapper,
  ImagePreview,
} from './styles'


interface Props {
  objectionableContent: ApiTypes.Dashboard.ObjectionableContent[],
  ownedHubs: string[]

  onGetObjectionableContent: () => void
  onReportResolve: (data: ApiTypes.Dashboard.ResolveReport) => void
}

export const ObjectionableContent: React.FC<Props> = (props) => {
  const { ownedHubs, objectionableContent } = props
  const { onGetObjectionableContent, onReportResolve } = props

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

  const compareByData = (a: ApiTypes.Dashboard.ObjectionableContent, b: ApiTypes.Dashboard.ObjectionableContent) => {
    if (a.created_at < b.created_at) {
      return -1
    }
    if (a.created_at > b.created_at) {
      return 1
    }
    return 0
  }

  const compareByResolved = (a: ApiTypes.Dashboard.ObjectionableContent, b: ApiTypes.Dashboard.ObjectionableContent) => {
    if (a.resolved_at === '') {
      return -1
    }
    if (a.resolved_at !== '') {
      return 1
    }
    return 0
  }

  useEffect(() => {
    onGetObjectionableContent()
  }, [ownedHubs, onGetObjectionableContent])

  return (
    <DashboardSection>
      <Header>
        <Title>Objectionable content</Title>
      </Header>
      {Boolean(objectionableContent.length) && objectionableContent.sort(compareByData).sort(compareByResolved).map(item => (
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
            <DeleteComplainContentDialog {...{ message: item.text, id: item.id, sourceHost: item.sourceHost }} />
            <UserEjectDialog {...{
              userName: item.author_name,
              userId: item.author_id,
              reportId: item.id,
              sourceHost: item.sourceHost
            }} />
            <ResolveButton
              disabled={item.resolved_at ? true : false}
              onClick={() => onReportResolve({
                host: item.sourceHost,
                body: {
                  report_id: item.id,
                }
              })}
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

type DispatchProps = Pick<Props, 'onGetObjectionableContent' | 'onReportResolve'>
const mapDispatchToProps = (dispatch): DispatchProps => ({
  onGetObjectionableContent: () => dispatch(Actions.dashboard.getMessageReportsRequest()),
  onReportResolve: (data: ApiTypes.Dashboard.ResolveReport) => dispatch(Actions.dashboard.resolveReportRequest(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ObjectionableContent)
