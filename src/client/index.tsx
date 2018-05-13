import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const client = new ApolloClient({ uri: '/graphql', connectToDevTools: true });

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<ApolloApp />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
