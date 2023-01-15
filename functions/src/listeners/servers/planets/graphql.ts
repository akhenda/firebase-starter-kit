import { ApolloServer } from '@apollo/server';

import { PlanetModel } from '@src/models/planet';

interface PlanetsResolverArgs {
  id: string;
}

interface AddPlanetMutationParams {
  name: string;
  habitable: boolean;
}

export const resolvers = {
  Mutation: {
    addPlanet: async (_: unknown, { name, habitable }: AddPlanetMutationParams) => {
      const doc = await PlanetModel.create({ habitable, name });

      return doc?.id;
    },
  },
  Query: {
    planet: async (_: unknown, args: PlanetsResolverArgs) => {
      const doc = await PlanetModel.getOne(args.id);

      return { ...doc?.data, id: doc?.ref.id };
    },
    planets: async () => {
      const docs = await PlanetModel.getAll();

      return docs.map((doc) => ({ ...doc?.data, id: doc?.ref.id }));
    },
  },
};

export const typeDefs = `#graphql
  type Planet {
    id: ID
    name: String
    habitable: Boolean
    messages: [String]
  }

  type Query {
    planets: [Planet]
    planet(id: ID!): Planet
  }

  type Mutation {
    addPlanet(name: String!, habitable: Boolean!): ID
  }
`;

export default function getGraphQLServer() {
  const server = new ApolloServer({
    introspection: true,
    resolvers,
    typeDefs,
  });

  return server;
}
