import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

const dbs = process.env.DATABASE?.split(" ")

const clients: ApolloClient<NormalizedCacheObject>[] = dbs ? dbs.map(db =>
  new ApolloClient({
    cache: new InMemoryCache(),
    uri: `http://localhost:8080/${db}/graphql`,
  }) 
) : []

export default clients