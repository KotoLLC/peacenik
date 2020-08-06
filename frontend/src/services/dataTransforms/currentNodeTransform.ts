import { CommonTypes } from '../../types'

interface DataFromBackend {
  [key: string]: string
}

export const currentNodeBack2Front = (data: DataFromBackend): CommonTypes.NodeTypes.CurrentNode => {
  let result: CommonTypes.NodeTypes.CurrentNode = {
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