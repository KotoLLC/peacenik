
import React from 'react'
import Message from '@view/pages/MessagesPage/Message'
import { ApiTypes } from 'src/types'
import { EmptyMessage, PreloaderWrapper } from '@view/pages/MessagesPage/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { ButtonsWrapper } from './styles'
import { RouteComponentProps } from 'react-router-dom'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import queryString from 'query-string'

const test: ApiTypes.Messages.Message = {
  attachment: 'http://127.0.0.1:9000/koto-node-12020/IMG_20200508_093622-5EqnmdXTp5.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20200819%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200819T094009Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=4b17ba47895a7e239ad40c67f37d2bc6bbd7110a36e9ef957185df3a204af06d',
  attachment_thumbnail: 'http://127.0.0.1:9000/koto-node-12020/IMG_20200508_093622-5EqnmdXTp5.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20200819%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200819T094009Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=4b17ba47895a7e239ad40c67f37d2bc6bbd7110a36e9ef957185df3a204af06d',
  attachment_type: 'image/jpeg',
  created_at: '2020-08-18T17:38:37.568+03:00',
  id: '1de807fc-0f1c-4d97-932e-ca45b9dffb67',
  updated_at: '2020-08-18T17:38:37.568+03:00',
  user_id: 'acf47aa3-2033-4e38-8f81-5d56f8d5056d',
  user_name: 'andrey9',
  sourceHost: 'http://localhost:12020',
  messageToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTc4MzkzNTksImh1YiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTIwMjAiLCJpZCI6IjU2M2M1Njg1LTk0ZjUtNDQwOC1hYTEyLWUzYTlhMWViZGU4MyIsIm5hbWUiOiJkaW1hIiwic2NvcGUiOiJnZXQtbWVzc2FnZXMiLCJ1c2VycyI6WyI1NjNjNTY4NS05NGY1LTQ0MDgtYWExMi1lM2E5YTFlYmRlODMiLCJhY2Y0N2FhMy0yMDMzLTRlMzgtOGY4MS01ZDU2ZjhkNTA1NmQiLCJiM2ZlMDdkYy01OTYwLTRkNmMtODBlZC1jMTRmZjJkNTBkYjAiLCJmZGVkODk4My01MGE0LTRjZjUtOTQ5Zi01ZjIyZDdiNzAyNTAiXX0.JJOMQwStnFQgFWMjpG1ZzXKU91rVe6gyJIKzSr99itc3nqihUvzOeieekeQXRf-Z4z4UMzNuPFNzN7-7NFhYPZ4g8lQRfKg8FmGLp9qlO0Y-KVc3UxgRzVKt1YLCx2ZsFkqskzBYcCTFSDwBVw_fIAuu33RB1GgUm5bcxBzxzyI',
  text: 'some text',
  comments: [{
    created_at: '2020-08-17T15:35:05.041+03:00',
    id: '8be4af2a-2e9e-43c5-a749-7b4c8b41710c',
    text: '# hello! some code here',
    updated_at: '2020-08-17T15:39:38.590+03:00',
    user_id: '563c5685-94f5-4408-aa12-e3a9a1ebde83',
    user_name: 'dima',
    sourceHost: 'http://localhost:12020',
  }],
}

interface Props extends RouteComponentProps { }

export const NotificationsInfo: React.SFC<Props> = React.memo((props) => {

  const { history } = props
  let isCommentsOpen = false

  const parsed = queryString.parse(history.location.search)

  if (parsed?.type?.indexOf('comment') !== -1) {
    isCommentsOpen = true
  }

  if (!false) {
    return (
      <EmptyMessage>
        page in process 
        {/* <PreloaderWrapper>
          <CircularProgress />
        </PreloaderWrapper> */}
      </EmptyMessage>
    )
  } else {
    return (
      <>
        <Message {...test} isAuthor={false} isCommentsOpenByDeafult={isCommentsOpen} />
        <ButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => history.goBack()}
          >back</Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => history.push('/messages')}
          >Messages</Button>
        </ButtonsWrapper>
      </>
    )
  }
})