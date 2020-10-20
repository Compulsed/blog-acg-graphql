const { fetch } = require('cross-fetch');
const { print, graphql } = require('graphql');
const { wrapSchema, introspectSchema  } = require('@graphql-tools/wrap');
const { mergeSchemas } = require('@graphql-tools/merge');

const executorWithUrl = (url) => async ({ document, variables }) => {
  const query = print(document);
  const fetchResult = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables })
  });
  return fetchResult.json();
};

const getSchema = async (url) => {
    const executor = executorWithUrl(url)

    const schema = wrapSchema({
        schema: await introspectSchema(executor),
        executor,
    });
    return schema;
}

const handler = async (event, context) => {
    console.log(JSON.stringify({ event }, null, 2));

    const payload = JSON.parse(event.body);
    const principalId = event.headers.Authorization || null;

    const mergedSchemas = mergeSchemas({
        schemas: Promise.all([
            getSchema('http://localhost:4000/dev/graphql'), // Series
            getSchema('http://localhost:5000/dev/graphql'), // Content            
            getSchema('http://localhost:6000/dev/graphql'), // Identity
        ]),
    });

    const response = await graphql(
        mergedSchemas,
        payload.query
    );

    return {
        statusCode: 200,
        body: JSON.stringify({ response }, null, 2)
    };
};

module.exports = { handler }