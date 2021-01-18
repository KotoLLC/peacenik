import { ApiTypes } from 'src/types'

export const myGroupsFromBackToFront = (data: ApiTypes.Groups.Group[]): ApiTypes.Groups.RecievedGroup[] => {
 if (!data?.length) return []

 return data.map(item => {
   return {
     group: item,
     status: 'member',
   }
 })
  
}