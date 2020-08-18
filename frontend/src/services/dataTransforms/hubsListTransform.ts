import { ApiTypes, CommonTypes } from 'src/types'

export const hubsListBack2Front = (data: ApiTypes.Hubs.Hub[]): CommonTypes.HubTypes.Hub[] => {
  let result: CommonTypes.HubTypes.Hub[] = []

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