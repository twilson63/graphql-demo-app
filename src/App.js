import React, { useState, useEffect } from 'react'

const doQuery = setData => () => {
  // graphQL Query
  // doGraphql(`
  // `)
  //   .then(res => res.json())
  //   .then(data => setData(data))
}

export default () => {
  const [data, setData] = useState({})
  useEffect(doQuery(setData), [])
  return (
    <div>
      <h1>GraphQL Demo</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

function doGraphql(query) {
  return fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'bWVAZW1haWwuY29t'
    },
    body: JSON.stringify({ query })
  })
}
