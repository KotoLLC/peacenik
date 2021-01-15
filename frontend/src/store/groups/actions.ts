
import { ApiTypes } from 'src/types'

export enum Types {
  ADD_GROUP_REQUEST = 'ADD_GROUP_REQUEST',
  ADD_GROUP_SUCCESS = 'ADD_GROUP_SUCCESS',
}

const addGroupRequest = (payload: ApiTypes.Groups.AddGroup) => ({
  type: Types.ADD_GROUP_REQUEST,
  payload
})

const addGroupSucces = (payload: boolean) => ({
  type: Types.ADD_GROUP_SUCCESS,
  payload
})

export default {
  addGroupRequest,
  addGroupSucces,
}