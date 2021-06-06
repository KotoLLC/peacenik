import React from 'react'
import Iframe from 'react-iframe'

interface Props {
  text: string
}

export const YoutubeFrame: React.FC<Props> = React.memo((props) => {
  const { text } = props

  if (!text) return null

  // eslint-disable-next-line
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const urls = text.match(urlRegex)

  if (!urls?.length) return null

  // tslint:disable-next-line
  let Element: any = null

  urls.forEach((item) => {
    const videoId = item.match(youtubeRegex)

    if (videoId && videoId[2].length === 11) {
      Element = <Iframe
        url={`https://www.youtube.com/embed/${videoId[2]}`}
        width="100%"
        height="450px"
        display="block"
        loading="lazy"
        frameBorder={0}
        position="relative" />
    }
  })

  return Element

})