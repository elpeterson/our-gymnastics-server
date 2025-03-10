import { ApolloServer } from '@apollo/server';
import { Pool } from 'pg';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers';

// Define the Enum types
const programTypes = `#graphql
  enum ProgramType {
    Womens
    Mens
    Rhythmic
    Acrobatic
    Tumbling
    TeamGym
  }
`;

const meetStatuses = `#graphql
  enum MeetStatus {
    Open
    Closed
    Complete
  }
`;

// Define the Object types
const typeDefs = `#graphql
  ${programTypes}
  ${meetStatuses}

  type Person {
    personId: ID!
    clubId: ID
    firstName: String!
    lastName: String!
    dob: Date
    city: String
    state: String
    zip: String
    country: String
    gender: String
  }

  type Club {
    clubId: ID!
    name: String!
    shortName: String
    address1: String
    address2: String
    city: String
    state: String
    zip: String
    website: String
    email: String
    phone: String
    fax: String
  }

  type Session {
    sessionId: ID!
    sanctionId: ID!
    name: String
    date: Date!
    time1: String
    time2: String
    time3: String
    time4: String
    squadA: String
    squadB: String
    squadC: String
    squadD: String
    squadE: String
    squadF: String
    squadG: String
    squadH: String
    squadI: String
    program: ProgramType
  }

  type ResultSet {
    resultSetId: ID!
    sessionId: ID!
    level: String!
    division: String!
    official: Boolean!
    status: String
  }

  type Score {
    scoreId: ID!
    personId: ID!
    clubId: ID!
    sanctionId: ID!
    eventId: String!
    programId: ProgramType!
    resultSetId: ID!
    sessionId: String!
    sessionSort: Int
    difficulty: Float
    execution: Float
    deductions: Float
    attempt: Int
    score1: Float
    score2: Float
    score3: Float
    score4: Float
    score5: Float
    score6: Float
    finalScore: Float!
    rankSort: Int
    rank: Int!
    tie: Boolean!
    bibNumber: Int!
    place: String!
    lastUpdate: DateTime!
    combinedScore: Float
    combinedSessionId1: ID
    combinedSessionId2: ID
    combinedSessionId3: ID
    combinedSessionId4: ID
    combinedSession1Score: Float
    combinedSession2Score: Float
    combinedSession3Score: Float
  }

  type Sanction {
    sanctionId: ID!
    name: String!
    startDate: Date!
    endDate: Date!
    address1: String
    address2: String
    city: String!
    state: String!
    zip: String
    status: MeetStatus!
    type: String!
    siteName: String!
    siteLink: String
    disciplineTypeId: Int!
    meetStatus: MeetStatus!
    time1: String
    time2: String
    time3: String
    time4: String
    apikey: String
    vendorApiKey: String
    feature: String
    logoUrl: String
    bannerImageUrl: String
    hidden: Boolean!
    featuredEventId: ID
    program: ProgramType
    website: String
    sessions: [Session!]!
    resultSets: [ResultSet!]!
    people: [Person!]!
    clubs: [Club!]!
    scores: [Score!]!
  }

  type Query {
    sanction(sanctionId: ID!): Sanction
    meets: [Sanction!]!
    meet(sanctionId: ID!): Sanction
    meetsByProgram(program: ProgramType!): [Sanction!]!
    meetsByDateRange(startDate: Date, endDate: Date): [Sanction!]!
    pastMeets: [Sanction!]!
    score(scoreId: ID!): Score
  }
// `;

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
