import { ApiTypes, NodeTypes } from '../../types'

export const nodesListBack2Front = (data: ApiTypes.Nodes.Node[]): NodeTypes.Node[] => {
  let result: NodeTypes.Node[] = []

  if (data && data.length) {
    result = data.map(item => (
      {
        domain: item.address, 
        author: item.user.name, 
        created: item.created_at, 
        aproved: item.approved_at ? item.approved_at : '', 
        description: item.details,
        id: item.id
      }
    ))
  }

  return result 
}