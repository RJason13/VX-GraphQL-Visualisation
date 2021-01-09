import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://fakerql.nplan.io/graphql',
    cache: new InMemoryCache()
});

const getApolloClient = () => client;

export { getApolloClient };