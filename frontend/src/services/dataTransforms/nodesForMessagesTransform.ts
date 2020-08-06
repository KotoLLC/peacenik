import { CommonTypes } from '../../types'

interface DataFromBackend {
  [key: string]: string
}
export const nodesForMessagesBack2Front = (data: DataFromBackend): CommonTypes.NodeTypes.CurrentNode[] => {
  let result: CommonTypes.NodeTypes.CurrentNode[] = []

  if (data) {
    return Object.entries(data).map(([key, value]) => {
      return {
        host: key,
        token: value,
      }
    })
  }

  return result 
}