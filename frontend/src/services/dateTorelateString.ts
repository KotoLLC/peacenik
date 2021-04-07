import { ApiTypes } from 'src/types'
import moment from 'moment'

export const dateTorelateString = (d: string | null) => {
  if(!d) return;
  const current = new Date();
  const oldDate = new Date(d);
  const diffSecond = (current.getTime() - oldDate.getTime()) / 1000;

  if(diffSecond < 60) {
    return 'Just a moment'
  } else if(diffSecond < 600) {
    return 'Less in 10 min'
  } else if(diffSecond < 1800) {
    return `${Math.ceil(diffSecond/60)} mins ago`
  } else if(diffSecond < 12 * 3600) {
    return `${Math.ceil(diffSecond/3600)} hours ago`
  } else {
    const y = oldDate.getFullYear();
    const m = oldDate.getMonth() + 1;
    const d = oldDate.getDate();
    return `${y}-${m}-${d}`
  }
  
}