import {
  useUpdateUserByIdMutation,
  useGetUsersQuery,
  useGetUsersAndPostsQuery
} from '../generated/graphql'

export const useGetUsers = useGetUsersQuery
export const useGetUsersAndPosts = useGetUsersAndPostsQuery
export const useUpdateUserById = useUpdateUserByIdMutation