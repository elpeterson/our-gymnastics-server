import { ApolloServer } from '@apollo/server';
import { Pool } from 'pg';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers';
import { readFileSync } from 'fs';

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

// Create a new PostgreSQL pool
const pool = new Pool({
  user: 'quorra_postgres',
  host: '192.168.1.100',
  database: 'gymnastics',
  password: 'Five-Worshiper-Wildland8',
  port: 5432,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ pool }),
});

// // Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
