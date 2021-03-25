import { ApiTypes, CommonTypes } from 'src/types'
import uniqBy from 'lodash.uniqby'

function getUserNamesFromUserFriends(data: ApiTypes.User[]): CommonTypes.UserNameData[] {
  const usersNames: CommonTypes.UserNameData[] = []

  data.forEach(item => {
    if (item?.name) {
      usersNames.push({
        userName: item.name,
        userFullName: item.full_name,
        userId: item.id,
      })
    }
  })

  return usersNames
}

function checkCurrentUserName(data: CommonTypes.UserNameData | undefined): string {
  let currentUserName = ''

  if (data !== undefined) {
    currentUserName = data?.userFullName || `@${data?.userName}`
  }

  return currentUserName
}

function getMyProfile(): CommonTypes.UserNameData {

  const peacenikProfile = localStorage.getItem('peacenikProfile')
  const myProfile = {
    userName: '',
    userFullName: '',
    userId: '',
  }

  if (peacenikProfile) {
    const profile: ApiTypes.Profile.UserProfile = JSON.parse(peacenikProfile)

    myProfile.userName = profile?.user?.name
    myProfile.userFullName = profile?.user?.full_name
    myProfile.userId = profile?.user?.id
  }

  return myProfile

}

export function setUserNames(data: ApiTypes.Friends.Friend[]) {
  const result = []

  data.forEach(item => {
    if (item?.user?.name) {
      result.push({
        userName: item?.user?.name,
        userFullName: item?.user?.full_name,
        userId: item?.user?.id,
      } as never)
     
    }

    if (item?.friends?.length) {
      const friends = item?.friends?.map(friend => friend.user)
      result.push(getUserNamesFromUserFriends(friends) as never)
    }
  })

  result.push(getMyProfile() as never)
  localStorage.setItem('peacenikUsersNames', JSON.stringify(uniqBy(result.flat(1), 'userId')))
}

export function getUserNameByUserId(userId: string): string {
  const peacenikUsersNames = localStorage.getItem('peacenikUsersNames')
  
  if (peacenikUsersNames) {
    const usersNames: CommonTypes.UserNameData[] = JSON.parse(peacenikUsersNames)
    const currentUserNameData = usersNames.find(item => item.userId === userId)
    return checkCurrentUserName(currentUserNameData)
  } else {
    return ''
  }
}