import { CommonTypes } from 'src/types'

interface DataFromBackend {
  [key: string]: string
}
export const messageHubsForMessagesBack2Front = (data: DataFromBackend): CommonTypes.MessageHubTypes.CurrentHub[] => {
  let result: CommonTypes.MessageHubTypes.CurrentHub[] = []

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