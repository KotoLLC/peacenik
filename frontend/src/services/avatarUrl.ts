// @ts-ignore
const userHubUrl: string = window.apiEndpoint

export function getAvatarUrl(id: string) {
  return `${userHubUrl}/image/avatar/${id}`
}