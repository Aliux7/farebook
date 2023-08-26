import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import "../src/styles/index.css"
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

// const httpLink = new HttpLink({
//   uri: 'http://localhost:7778/query'
// });

// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:3000/`,
//   options: {
//     reconnect: true
//   }
// });

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// );

// const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache()
// });

const client = new ApolloClient({
  uri: "http://localhost:7778/query",
  cache: new InMemoryCache()
})

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>
);

