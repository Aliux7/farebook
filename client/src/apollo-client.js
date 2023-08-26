import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:7778', // Replace with your GraphQL server endpoint
  cache: new InMemoryCache(),
});

export default client;
