import gql from 'graphql-tag'

console.log("getUsers query passed!")
export default gql`
  query getUsers {
    allUsers {
      nodes {
        email
        id
        name
        createdAt
      }
    }
  }
`