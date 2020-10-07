import { Types } from './actions'
import { ApiTypes } from 'src/types'

export interface State {
  objectionableContent: ApiTypes.Dashboard.ObjectionableContent[]
}

const initialState: State = {
  objectionableContent: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_MESSAGE_REPORTS_FROM_HUB_SUCCESS: {
      return {
        ...state, ...{
          objectionableContent: action.payload
        }
      }
    }
    default: return state
  }
}

export default reducer
