import { ApiTypes } from 'src/types'

export const usersInviteStatusFromBackToFront = (data: ApiTypes.User[], statuses: ApiTypes.Friends.InvitationStatus[]): ApiTypes.User[] => {
 if (!data?.length) return []

 return data.map((item, counter) => {

  item.invite_status = statuses[counter]
  return item
 })

}