import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import Routes from './components/Routes';
const client = new ApolloClient({
  uri: "http://localhost:8800/graphql",
  cache: new InMemoryCache()
});




ReactDOM.render(
  <BrowserRouter>
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Routes/>
    </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
