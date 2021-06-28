import React from 'react';
import './App.css';
import NetworkGraph from './pages/NetworkGraph';
import Users from './components/Users'
import { ApolloProvider } from '@apollo/react-hooks'
import client from './ApolloClient'

function App() {
  return (
    <ApolloProvider client={client}>
      <NetworkGraph /> 
      <Users />
    </ApolloProvider>
  );
}

export default App;
