# Basic GraphQL Demo

This is a blank reactjs project used to demo a graphql client side implementation.

> GraphQL is the future

## GraphQL on the client

Using fetch we can call a graphql server and get some data:

```js
fetch('http://localhost:4000', {
  headers: {
    'content-type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify({
    query: `
      query allLaunches {
        launches {
          launches {
            id
            site
            rocket {
              name
            }
          }
        }
      }
  })
}).then(res => res.json())
  .then(data => console.log(data))
```

> This is a little limited, no caching, no subscriptions, etc

## Apollo Client

You get State Management + Data Fetching

```sh
npm install apollo-client@alpha react-apollo graphql-tag
```

.env

```
ENGINE_API_KEY=service:your-key-here
```

apollo.config.js

```
module.exports = {
  client: {
    name: 'Space Explorer [web]',
    service: 'space-explorer',
  },
};
```

index.js

```js
import { ApolloClient } from 'apollo-client'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})
```

index.js

```js
import { ApolloProvider } from 'react-apollo'

ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById('root')
)
```

launches.js

```js
import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import LaunchTile from '../components/launch-tile'
import Header from '../components/header'
import Button from '../components/button'
import Loading from '../components/loading'

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        id
        isBooked
        rocket {
          id
          name
        }
        mission {
          name
          missionPatch
        }
      }
    }
  }
`

export default function Launches() {
  return (
    <Query query={GET_LAUNCHES}>
      {({ data, loading, error, fetchMore }) => {
        if (loading) return <Loading />
        if (error) return <p>ERROR</p>

        return (
          <Fragment>
            <Header />
            {data.launches &&
              data.launches.launches &&
              data.launches.launches.map(launch => (
                <LaunchTile key={launch.id} launch={launch} />
              ))}
          </Fragment>
        )
      }}
    </Query>
  )
}
```

pagination

launches.js

```js
{
  data.launches && data.launches.hasMore && (
    <Button
      onClick={() =>
        fetchMore({
          variables: {
            after: data.launches.cursor
          },
          updateQuery: (prev, { fetchMoreResult, ...rest }) => {
            if (!fetchMoreResult) return prev
            return {
              ...fetchMoreResult,
              launches: {
                ...fetchMoreResult.launches,
                launches: [
                  ...prev.launches.launches,
                  ...fetchMoreResult.launches.launches
                ]
              }
            }
          }
        })
      }
    >
      Load More
    </Button>
  )
}
```

Mutations

login.js

```js
import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import LoginForm from '../components/login-form'

const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`

export default function Login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({ login }) => {
            localStorage.setItem('token', login)
            client.writeData({ data: { isLoggedIn: true } })
          }}
        >
          {(login, { loading, error }) => {
            // this loading state will probably never show, but it's helpful to
            // have for testing
            if (loading) return <Loading />
            if (error) return <p>An error occurred</p>

            return <LoginForm login={login} />
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  )
}
```

index.js

```js
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token')
    }
  })
})
```

resolvers.js

```js
import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [Launch]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`
```

initialize the store

```js
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token')
    }
  }),
  initializers: {
    isLoggedIn: () => !!localStorage.getItem('token'),
    cartItems: () => []
  }
})
```

Query local data

```js
import { Query, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'

import Pages from './pages'
import Login from './pages/login'

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

injectStyles()
ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
  </ApolloProvider>,
  document.getElementById('root')
)
```
