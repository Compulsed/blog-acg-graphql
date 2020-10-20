const { ApolloServer, gql } = require('apollo-server-lambda');

const identities = {
    'auth0|123': {
        userId: 'auth0|123',
        name: 'Sam K',
    },
    'auth0|456': {
        userId: 'auth0|456',
        name: 'Ryan K',
    },
};

const typeDefs = gql`
    type User {
        userId: ID!
        name: String
    }

    type Query {
        usersById(userId: String): User
    }
`;

const resolvers = {   
    Query: {
        usersById: (_, { userId }) => identities[userId]
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

exports.handler = server.createHandler();