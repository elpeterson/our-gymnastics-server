import {
  QueryResolvers,
  SanctionResolvers,
  PersonResolvers,
  ClubResolvers,
  SessionResolvers,
  ResultSetResolvers,
  ScoreResolvers,
  ProgramType,
  MeetStatus,
} from './generated/types'; // Generated types from your schema
import { Pool } from 'pg';

// Helper function to safely handle database queries
async function queryDatabase(
  pool: Pool,
  queryText: string,
  params: any[] = []
): Promise<any[]> {
  try {
    const result = await pool.query(queryText, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed'); // Or a more specific error
  }
}

export const resolvers: QueryResolvers &
  SanctionResolvers &
  PersonResolvers &
  ClubResolvers &
  SessionResolvers &
  ResultSetResolvers &
  ScoreResolvers = {
  Query: {
    sanction: async (_parent, { sanctionId }, { pool }) => {
      const result = await queryDatabase(
        pool,
        'SELECT * FROM meets WHERE sanction_id = $1',
        [sanctionId]
      );
      return result[0];
    },
    meets: async (_parent, _args, { pool }) => {
      return await queryDatabase(pool, 'SELECT * FROM meets');
    },
    meet: async (_parent, { sanctionId }, { pool }) => {
      const meetResult = await queryDatabase(
        pool,
        'SELECT * FROM meets WHERE sanction_id = $1',
        [sanctionId]
      );
      const meet = meetResult[0];
      if (!meet) return null;

      const sessionsResult = await queryDatabase(
        pool,
        'SELECT * FROM sessions WHERE sanction_id = $1',
        [sanctionId]
      );
      meet.sessions = sessionsResult;

      // Add similar queries for resultSets, people, clubs, and scores

      return meet;
    },
    meetsByProgram: async (_parent, { program }, { pool }) => {
      const programValue = ProgramType[program]; // Get the integer value of the enum
      const result = await queryDatabase(
        pool,
        'SELECT * FROM meets WHERE program = $1',
        [programValue]
      );
      return result;
    },
    meetsByDateRange: async (_parent, { startDate, endDate }, { pool }) => {
      const result = await queryDatabase(
        pool,
        'SELECT * FROM meets WHERE start_date >= $1 AND end_date <= $2',
        [startDate, endDate]
      );
      return result;
    },
    pastMeets: async (_parent, _args, { pool }) => {
      // Add your query to fetch past meets.  Perhaps add a date filter?
      return await queryDatabase(
        pool,
        'SELECT * FROM meets WHERE end_date < NOW()'
      ); // Example, add better date filtering
    },
    score: async (_parent, { scoreId }, { pool }) => {
      const result = await queryDatabase(
        pool,
        'SELECT * FROM scores WHERE score_id = $1',
        [scoreId]
      );
      return result[0];
    },
  },
  Sanction: {
    sessions: async (parent, _args, { pool }) => {
      const result = await queryDatabase(
        pool,
        'SELECT * FROM sessions WHERE sanction_id = $1',
        [parent.sanction_id]
      );
      return result;
    },
    resultSets: async (parent, _args, { pool }) => {
      const result = await queryDatabase(
        pool,
        'SELECT * FROM result_sets WHERE sanction_id = $1',
        [parent.sanction_id]
      );
      return result;
    },
    people: async (parent, _args, { pool }) => {
      //This is a many to many relationship you would need a join
      const result = await queryDatabase(
        pool,
        `SELECT * FROM people p JOIN sanction_people sp ON p.person_id = sp.person_id WHERE sp.sanction_id = $1`,
        [parent.sanction_id]
      );
      return result;
    },
    clubs: async (parent, _args, { pool }) => {
      //This is a many to many relationship you would need a join
      const result = await queryDatabase(
        pool,
        `SELECT * FROM clubs c JOIN sanction_clubs sc ON c.club_id = sc.club_id WHERE sc.sanction_id = $1`,
        [parent.sanction_id]
      );
      return result;
    },
    scores: async (parent, _args, { pool }) => {
      const result = await queryDatabase(
        pool,
        'SELECT * FROM scores WHERE sanction_id = $1',
        [parent.sanction_id]
      );
      return result;
    },
  },
  Person: {
    // Add resolvers for Person fields if needed (e.g., club details)
  },
  Club: {
    // Add resolvers for Club fields if needed
  },
  Session: {
    // Add resolvers for Session fields if needed
  },
  ResultSet: {
    // Add resolvers for ResultSet fields if needed
  },
  Score: {
    // Add resolvers for Score fields if needed
  },
};
