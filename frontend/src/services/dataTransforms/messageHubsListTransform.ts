import { ApiTypes, CommonTypes } from 'src/types'

export const messageHubsListBack2Front = (data: ApiTypes.MessageHubs.Hub[]): CommonTypes.MessageHubTypes.Hub[] => {
  let result: CommonTypes.MessageHubTypes.Hub[] = []

  if (data && data?.length) {
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