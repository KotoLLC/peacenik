import { CommonTypes } from 'src/types'

interface DataFromBackend {
  [key: string]: string
}
export const hubsForMessagesBack2Front = (data: DataFromBackend): CommonTypes.HubTypes.CurrentHub[] => {
  let result: CommonTypes.HubTypes.CurrentHub[] = []

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