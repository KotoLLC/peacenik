import { ApiTypes } from 'src/types'

export interface MentionFriend {
  id: string,
  display: string,
}

export const friendsToMentionFriends = (data: ApiTypes.Friends.Friend[]): MentionFriend[] => {
  let result: MentionFriend[] = []

  if (data?.length) {
    data.forEach(item => {
      result.push({
        id: item.user.id,
        display: item.user.name,
      })
    })
  }

  return result 
}