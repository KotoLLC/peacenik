import { ApiTypes } from 'src/types'
import moment from 'moment'

export const sortByDate = (data: ApiTypes.Messages.Message[]) => {
  return data.sort((a, b) => {
    return moment(b.created_at).diff(a.created_at)
  })
}