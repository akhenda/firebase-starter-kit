import { ApolloServer } from '@apollo/server';

import { PlanetModel } from '@src/models/planet';

export default function getGraphQLServer() {
  const resolvers = {
    Query: {
      planets: async () => {
        const docs = await PlanetModel.getAll();

        return docs.map((doc) => doc.data);
      },
    },
  };

  const typeDefs = `#graphql
    type Planet {
      name: String
      habitable: Boolean
      messages: [String]
    }

    type Query {
      planets: [Planet]
    }
  `;

  const server = new ApolloServer({
    introspection: true,
    resolvers,
    typeDefs,
  });

  return server;
}
