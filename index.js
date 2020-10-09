const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const moesif = require('moesif-nodejs');
const bodyParser = require('body-parser-graphql');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
{
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
},
{
    title: 'Jurassic Park',
    author: 'Michael Crichton',
},
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
var schema = buildSchema(`
    # Comments in GraphQL are defined with the hash (#) symbol.

    # This "Book" type can be used in other type declarations.
    type Book {
        title: String
        author: String
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
    books: [Book]
    }
`);

// The root provides a resolver function for each API endpoint
var root = {
        books: () => books,
};

var app = express();

const moesifOptions = {
    applicationId: 'Your Moesif Application Id'
};

const moesifMiddleware = moesif(moesifOptions);

// this adds moesif middleware to express app.
app.use(moesifMiddleware);

// body-parser that supports the application/graphql type
app.use(bodyParser.bodyParserGraphQL())

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const port = 6868;
app.listen({ port }, () => {
  console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`);
})
