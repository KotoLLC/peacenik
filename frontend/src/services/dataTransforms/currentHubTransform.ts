import { CommonTypes } from 'src/types'

interface DataFromBackend {
  [key: string]: string
}

export const currentHubBack2Front = (data: DataFromBackend): CommonTypes.HubTypes.CurrentHub => {
  let result: CommonTypes.HubTypes.CurrentHub = {
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