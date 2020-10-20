const { ApolloServer, gql } = require('apollo-server-lambda');

const series = [
    { 
        seriesId: 'aws-this-week',
        title: 'AWS This Week'
    },
    { 
        seriesId: 'acg-projects',
        title: 'ACG Projects'
    }
]

const episodesBySeriesId = {
    'aws-this-week': [
        { 
            seriesId: 'aws-this-week',
            episodeId: 'episode-1',
            title: 'AWS This Week Episode #1',
            contentId: 'video-1',
            authorId: 'auth0|123',
            free: true,
        },
        { 
            seriesId: 'aws-this-week',
            episodeId: 'episode-2',
            title: 'AWS This Week Episode #2',
            contentId: 'video-2',
            authorId: 'auth0|123',
            free: true,
        },
    ],
    'acg-projects': [
        { 
            seriesId: 'acg-projects',
            episodeId: 'episode-1',
            title: 'Learn how to deploy lambda #1',
            contentId: 'video-3',
            authorId: 'auth0|456',
            free: false,
        },
        { 
            seriesId: 'acg-projects',
            episodeId: 'episode-2',
            title: 'Learn how to deploy serverless applications in S3 #2',
            contentId: 'video-4',
            authorId: 'auth0|456',
            free: false,
        },
    ]
};

const typeDefs = gql`
    type VideoContent {
        contentId: ID!
        duration: Int
        url: String
    }

    # type User {
    #     userId: ID!
    #     name: String
    # }

    type Episode {
        episodeId: ID!
        seriesId: ID!
        title: String
        content: VideoContent
        # author: User            # TODO: Implement stitching here
    }

    type Series {
        seriesId: ID!
        title: String
        episodes: [Episode]
    }

    type Query {
        allSeries: [Series]
    }
`;

// Business logic
const validateContentAccess = (principalId, episode, content) => {
    if (episode.free) {
        return content;
    }

    if (!episode.free && principalId) { 
        return content;
    }

    return null;
}

const resolvers = {   
    Episode: {
        content(episode) {
            // TODO: Resolve content & validate business logic
        }
    },
    
    Series: {
        episodes: ({ seriesId }) => episodesBySeriesId[seriesId]
    },

    Query: {
        allSeries: () => series
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

exports.handler = server.createHandler();