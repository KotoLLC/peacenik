import { NodeTypes } from '../../types'

interface DataFromBackend {
  [key: string]: string
}

export const currentNodeBack2Front = (data: DataFromBackend): NodeTypes.CurrentNode => {
  let result: NodeTypes.CurrentNode = {
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