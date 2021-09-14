// @ts-ignore
const userHubUrl: string = window.apiEndpoint
// const userHubUrl: string = "https://central.peacenik.app/"

export function getAvatarUrl(id: string) {
  return `${userHubUrl}/image/avatar/${id}`
}

export function getGroupAvatarUrl(id: string) {
  return `${userHubUrl}/image/group/${id}`
}

export function getGroupCoverUrl(id: string) {
  return `${userHubUrl}/image/group/background/${id}`
}

export function getProfileCoverUrl(id: string) {
  return `${userHubUrl}/image/user/background/${id}`
}

export function getPublicUserAvatarUrl(id: string) {
  console.log('===> user Avatar url: ', `/image/user/${id}`)
  return `${userHubUrl}/image/user/${id}`
}
