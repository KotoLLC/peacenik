export const urlify = (text: string) => {
  // eslint-disable-next-line
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

  return text.replace(urlRegex, function(url: string) {
    return `[${url}](${url})`
  })
}
