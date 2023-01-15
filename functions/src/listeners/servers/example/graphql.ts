import { ApolloServer } from '@apollo/server';

const books = [
  {
    author: 'Kate Chopin',
    title: 'The Awakening',
  },
  {
    author: 'Paul Auster',
    title: 'City of Glass',
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
  Query: {
    books: () => books,
  },
};

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default server;
