import {
  useUpdateUserByIdMutation,
  useGetUsersQuery,
} from '../generated/graphql'

export const useGetUsers = useGetUsersQuery

export const useUpdateUserById = useUpdateUserByIdMutation