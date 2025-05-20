import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

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
    personId: Int!
    clubId: Int
    firstName: String!
    lastName: String!
    dob: String
    city: String
    state: String
    zip: String
    country: String
    gender: String
  }

  type Club {
    clubId: Int!
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
    gymnasts: [Person]
  }

  type Session {
    sessionId: Int!
    sanctionId: Int!
    name: String
    date: String!
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
    resultSetId: Int!
    sessionId: Int!
    level: String!
    division: String!
    official: Boolean!
    status: String
  }

  type Score {
    scoreId: Int!
    personId: Int!
    clubId: Int!
    sanctionId: Int!
    eventId: String!
    programId: ProgramType!
    resultSetId: Int!
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
    lastUpdate: String!
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
    sanctionId: Int!
    name: String!
    startDate: String!
    endDate: String!
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
 `;

// // Create a new PostgreSQL pool
// const pool = new Pool({
//   user: 'quorra_postgres',
//   host: '192.168.1.100',
//   database: 'gymnastics',
//   password: 'Five-Worshiper-Wildland8',
//   port: 5432,
// });

const server = new ApolloServer({
  typeDefs,
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
