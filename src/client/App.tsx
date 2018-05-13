import * as React from 'react';
import gql from 'graphql-tag';
import { graphql, Query } from 'react-apollo';
import './App.css';

const logo = require('./logo.svg');

type Book = {
  author: string;
  title: string;
};

const BOOKS_QUERY = gql`
  query Books {
    books {
      title
      author
    }
  }
`;

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Query query={BOOKS_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error :(</div>;

            return JSON.stringify(data);
          }}
        </Query>
      </div>
    );
  }
}

export default App;
