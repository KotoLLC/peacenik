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

