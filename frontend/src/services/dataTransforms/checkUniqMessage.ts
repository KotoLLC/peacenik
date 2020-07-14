import { ApiTypes, NodeTypes } from '../../types'

export const checkUniqMessage = (
  prevMessages: ApiTypes.Messages.Message[],
  newMessages: ApiTypes.Messages.Message[]): ApiTypes.Messages.Message[] => {

  let result: ApiTypes.Messages.Message[] = []

  if (prevMessages.length) {
    result = prevMessages.filter(prevMsg => newMessages.some(newMsg => newMsg.id !== prevMsg.id))
  } else {
    result = newMessages
  }

  // console.log('result', result)
  return result
} 