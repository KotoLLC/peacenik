import { CommonTypes } from 'src/types'

interface DataFromBackend {
  [key: string]: string
}

export const currentMessageHubBack2Front = (data: DataFromBackend): CommonTypes.MessageHubTypes.CurrentHub => {
  let result: CommonTypes.MessageHubTypes.CurrentHub = {
    host: '',
    token: '',
  }

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      result.host = key
      result.token = value
    })
  }

  return result 
}