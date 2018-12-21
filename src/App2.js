import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const launchById = gql`
  query launchById($id: ID!) {
    launch(id: $id) {
      id
      site
    }
  }
`

export default () => {
  return (
    <Query query={launchById} variables={{ id: '72' }}>
      {({ loading, error, data }) => {
        if (loading) return <h1>LOADING....</h1>
        if (error) return <h1>ERROR</h1>
        return (
          <div>
            <h1>Apollo GraphQL Demo</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
      }}
    </Query>
  )
}
