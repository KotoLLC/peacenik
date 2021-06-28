import gql from 'graphql-tag'

console.log("mutation query passed!")

export default gql`
    mutation updateUserById($id: Int!, $UserPatch: UserPatch!) {
        updateUserById(input: { id: $id, userPatch: $UserPatch }) {
            clientMutationId
        }
    }
`