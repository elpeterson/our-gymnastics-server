import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import pg from 'pg';
const { Pool } = pg;
import fetch from 'node-fetch';

// --- DATABASE SETUP ---
const pool = new Pool({
  user: 'quorra_postgres',
  host: '192.168.1.100',
  database: 'gymnastics',
  password: 'Five-Worshiper-Wildland8',
  port: 5432,
});
pool.on('connect', () => console.log('🎉 Database connected'));
pool.on('error', (err) =>
  console.error('🔥 Database connection error', err.stack)
);

// --- API DATA TYPE INTERFACES ---
interface ApiMeet {
  sanctionId: number;
  name: string;
  startDate: string;
  siteName: string;
}

interface ApiClub {
  clubId: number;
  name: string;
  shortName?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  emailAddress?: string;
  phone?: number;
}

interface ApiPerson {
  personId: number;
  clubId: number;
  firstName: string;
  lastName: string;
  gender: string;
}

interface ApiSession {
  sessionId: string;
  sanctionId: number;
  name: string;
  date: string;
  program: string;
}

interface ApiResultSet {
  resultSetId: number;
  sessionId: string;
  sanctionId: number;
  level: string;
  division: string;
  official: number;
}

interface ApiSanctionPerson {
  sanctionId: number;
  personId: number;
  clubId: number; // The club they competed for in THIS sanction
  sessionId: string;
  level: string;
  division: string;
  squad: string;
}

interface ApiSanctionData {
  sanction: {
    sanctionId: number;
    name: string;
    startDate: string;
    endDate: string;
    city: string;
    state: string;
    siteName: string;
    website: string;
    program: number;
    meetStatus: 'Open' | 'Closed' | 'Complete' | 'In progress' | 'Future';
    hasResults: boolean;
    address1: string;
    zip: string;
    logoUrl: string;
  };
  clubs: { [key: string]: ApiClub };
  people: { [key: string]: ApiPerson };
  sessions: ApiSession[];
  sessionResultSets: ApiResultSet[];
  sanctionPeople: { [key: string]: ApiSanctionPerson };
}

interface ApiScoresData {
  scores: {
    scoreId: number;
    resultSetId: number;
    personId: number;
    eventId: string;
    finalScore: string;
    rank: number;
    tie: number;
  }[];
}

// --- TYPE DEFS ---
const typeDefs = `#graphql
  enum ProgramType { Womens, Mens, Rhythmic, Acrobatic, Tumbling, TeamGym }
  enum MeetStatus { Open, Closed, Complete, InProgress, Future }

  type Club {
    clubId: Int!
    name: String
    city: String
    state: String
  }

  type Gymnast {
    gymnastId: Int!
    firstName: String!
    lastName: String!
    gender: String
    club: Club # Represents the gymnast's primary/current club
    historicalClub: Club # Represents the club they competed for in a specific meet
  }

  type Sanction {
    sanctionId: Int!
    name: String!
    startDate: String
    endDate: String
    city: String
    state: String
    siteName: String
    meetStatus: MeetStatus
    program: ProgramType
    sessions: [Session]
    gymnasts: [Gymnast]
  }

  type Session {
    sessionId: Int!
    sanctionId: Int!
    name: String
    sessionDate: String
    program: ProgramType
    resultSets: [ResultSet]
  }

  type ResultSet {
    resultSetId: Int!
    level: String
    division: String
    scores: [Score]
  }

  type Score {
    scoreId: Int!
    eventId: String!
    finalScore: Float!
    rank: Int
    tie: Boolean
    gymnast: Gymnast
  }

  type Query {
    meets(status: String!): [Sanction]
    sanction(sanctionId: Int!): Sanction
    gymnast(gymnastId: Int!): Gymnast
    sanctionsByGymnast(gymnastId: Int!): [Sanction]
  }

  # Add the new batch sync mutation
  type Mutation {
    syncSanctionAndParticipants(sanctionId: Int!): Sanction
    syncScores(resultSetId: Int!): [Score]
    syncSterlingGymData: [Sanction]
  }
`;

// --- DATA MAPPING HELPERS ---
const mapProgramIdToEnum = (id) => ({ 1: 'Womens', 2: 'Mens' }[id] || null);
const mapProgramStringToEnum = (str) =>
  ({ Men: 'Mens', Women: 'Womens' }[str] || null);

const safeParseInt = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? null : parsed;
};

const safeParseFloat = (
  value: string | number | null | undefined
): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? null : parsed;
};

// Maps the API's status string to our database ENUM value
const mapApiStatusToDbEnum = (status: string): string | null => {
  if (!status) return null;
  const lowerCaseStatus = status.toLowerCase();
  if (lowerCaseStatus === 'in progress') return 'InProgress';
  if (lowerCaseStatus === 'open') return 'Open';
  if (lowerCaseStatus === 'closed') return 'Closed';
  if (lowerCaseStatus === 'complete') return 'Complete';
  if (lowerCaseStatus === 'future') return 'Future';
  console.warn(`Unknown meet status from API: ${status}`);
  return null; // Return null for any unknown statuses
};

// --- CORE SYNC LOGIC (REFACTORED) ---
async function syncSanctionInternal(sanctionId: number, client: pg.PoolClient) {
  console.log(`Fetching full details for sanction ${sanctionId}...`);
  const response = await fetch(
    `https://api.myusagym.com/v2/sanctions/${sanctionId}`
  );
  if (!response.ok) {
    console.error(
      `Failed to fetch sanction ${sanctionId}. Status: ${response.status}`
    );
    return; // Skip this sanction if the fetch fails
  }
  const data = (await response.json()) as ApiSanctionData;

  // 1. Sync Sanction
  const s = data.sanction;
  const dbMeetStatus = mapApiStatusToDbEnum(s.meetStatus); // Use the new helper function

  await client.query(
    `INSERT INTO sanctions (sanction_id, name, start_date, end_date, city, state, site_name, website, program_id, meet_status, has_results, address1, zip, logo_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (sanction_id) DO UPDATE SET name = EXCLUDED.name, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, meet_status = EXCLUDED.meet_status;`,
    [
      s.sanctionId,
      s.name,
      s.startDate,
      s.endDate,
      s.city,
      s.state,
      s.siteName,
      s.website,
      s.program,
      dbMeetStatus,
      s.hasResults,
      s.address1,
      s.zip,
      s.logoUrl,
    ]
  );

  // 2. Sync Clubs
  for (const club of Object.values(data.clubs)) {
    await client.query(
      `INSERT INTO clubs (club_id, name, short_name, city, state, zip, website, email, phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (club_id) DO NOTHING;`,
      [
        club.clubId,
        club.name,
        club.shortName,
        club.city,
        club.state,
        club.zip,
        club.website,
        club.emailAddress,
        String(club.phone),
      ]
    );
  }

  // Create a set of club IDs we know about from this sanction's payload
  const knownClubIds = new Set(Object.values(data.clubs).map((c) => c.clubId));
  // Create a set to track gymnasts we have successfully saved and can therefore link
  const processedGymnastIds = new Set<number>();

  // 3. Sync Gymnasts
  for (const person of Object.values(data.people)) {
    // A gymnast must have a personId and a primary clubId to be valid
    if (person && person.personId && person.clubId) {
      // If their primary club wasn't in the sanction's club list, add a placeholder
      if (!knownClubIds.has(person.clubId)) {
        await client.query(
          `INSERT INTO clubs (club_id, name) VALUES ($1, $2) ON CONFLICT (club_id) DO NOTHING;`,
          [person.clubId, 'Unknown Club (placeholder)']
        );
      }
      // Now it's safe to insert the gymnast
      await client.query(
        `INSERT INTO gymnasts (gymnast_id, club_id, first_name, last_name, gender)
                 VALUES ($1, $2, $3, $4, $5) ON CONFLICT (gymnast_id) DO NOTHING;`,
        [
          person.personId,
          person.clubId,
          person.firstName,
          person.lastName,
          person.gender,
        ]
      );
      // Add the ID to our set of successfully processed gymnasts
      processedGymnastIds.add(person.personId);
    } else {
      // Log a warning if a gymnast is skipped due to missing data
      console.warn(
        `Skipping gymnast with missing data: ${person.firstName} ${person.lastName} (ID: ${person.personId})`
      );
    }
  }

  // 4. Sync Sessions
  for (const session of data.sessions) {
    const parsedSessionId = safeParseInt(session.sessionId);
    if (parsedSessionId !== null) {
      await client.query(
        `INSERT INTO sessions (session_id, sanction_id, name, session_date, program)
                 VALUES ($1, $2, $3, $4, $5) ON CONFLICT (session_id, sanction_id) DO NOTHING;`,
        [
          parsedSessionId,
          session.sanctionId,
          session.name,
          session.date,
          mapProgramStringToEnum(session.program),
        ]
      );
    } else {
      console.warn(
        `Skipping session with invalid sessionId: "${session.sessionId}" for sanction ${sanctionId}`
      );
    }
  }

  // 5. Sync Result Sets
  for (const rs of data.sessionResultSets) {
    const parsedSessionId = safeParseInt(rs.sessionId);
    if (parsedSessionId !== null) {
      await client.query(
        `INSERT INTO result_sets (result_set_id, session_id, sanction_id, level, division, official)
                 VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (result_set_id) DO NOTHING;`,
        [
          rs.resultSetId,
          parsedSessionId,
          rs.sanctionId,
          rs.level,
          rs.division,
          Boolean(rs.official),
        ]
      );
    } else {
      console.warn(
        `Skipping result_set with invalid sessionId: "${rs.sessionId}" for sanction ${sanctionId}`
      );
    }
  }

  // 6. Sync sanction_gymnasts link table
  for (const sp of Object.values(data.sanctionPeople)) {
    const parsedSessionId = safeParseInt(sp.sessionId);
    // Only link gymnasts that we successfully processed from the 'people' list
    if (parsedSessionId !== null && processedGymnastIds.has(sp.personId)) {
      await client.query(
        `INSERT INTO sanction_gymnasts (sanction_id, gymnast_id, session_id, level, division, squad, club_id_for_meet)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (sanction_id, gymnast_id) DO UPDATE SET club_id_for_meet = EXCLUDED.club_id_for_meet;`,
        [
          sp.sanctionId,
          sp.personId,
          parsedSessionId,
          sp.level,
          sp.division,
          sp.squad,
          sp.clubId,
        ]
      );
    } else {
      if (!processedGymnastIds.has(sp.personId)) {
        console.warn(
          `Skipping sanction_gymnasts link for personId ${sp.personId} because they were not found in the sanction's main 'people' list.`
        );
      } else {
        console.warn(
          `Skipping sanction_person with invalid sessionId: "${sp.sessionId}" for sanction ${sanctionId}`
        );
      }
    }
  }
  console.log(
    `✅ Successfully synced sanction ${sanctionId} and all participants.`
  );
}

// --- RESOLVERS ---
const resolvers = {
  Query: {
    meets: async (_, { status }) => {
      const res = await pool.query(
        'SELECT sanction_id AS "sanctionId", name, start_date AS "startDate", end_date AS "endDate", city, state, site_name AS "siteName", meet_status, program_id FROM sanctions WHERE meet_status = $1',
        [status]
      );
      return res.rows;
    },
    sanction: async (_, { sanctionId }) => {
      const res = await pool.query(
        'SELECT sanction_id AS "sanctionId", name, start_date AS "startDate", end_date AS "endDate", city, state, site_name AS "siteName", meet_status, program_id FROM sanctions WHERE sanction_id = $1',
        [sanctionId]
      );
      return res.rows[0];
    },
    gymnast: async (_, { gymnastId }) => {
      const res = await pool.query(
        'SELECT gymnast_id AS "gymnastId", first_name AS "firstName", last_name AS "lastName", gender, club_id FROM gymnasts WHERE gymnast_id = $1',
        [gymnastId]
      );
      return res.rows[0];
    },
    sanctionsByGymnast: async (_, { gymnastId }) => {
      const res = await pool.query(
        `
            SELECT s.sanction_id AS "sanctionId", s.name, s.start_date AS "startDate", s.site_name AS "siteName"
            FROM sanctions s
            JOIN sanction_gymnasts sg ON s.sanction_id = sg.sanction_id
            WHERE sg.gymnast_id = $1
            ORDER BY s.start_date DESC;
        `,
        [gymnastId]
      );
      return res.rows;
    },
  },

  Mutation: {
    syncSanctionAndParticipants: async (_, { sanctionId }) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await syncSanctionInternal(sanctionId, client);
        await client.query('COMMIT');

        const finalRes = await client.query(
          `
                SELECT sanction_id AS "sanctionId", name, start_date AS "startDate", end_date AS "endDate", city, state, site_name AS "siteName", meet_status, program_id
                FROM sanctions WHERE sanction_id = $1`,
          [sanctionId]
        );
        return finalRes.rows[0];
      } catch (e) {
        await client.query('ROLLBACK');
        console.error(`🔥 Failed to sync sanction ${sanctionId}:`, e);
        throw e;
      } finally {
        client.release();
      }
    },
    syncScores: async (_, { resultSetId }) => {
      console.log(`Fetching scores for result set ${resultSetId}...`);
      const response = await fetch(
        `https://api.myusagym.com/v2/resultsSets/${resultSetId}`
      );
      const data = (await response.json()) as ApiScoresData;

      if (!data.scores) return [];

      const savedScores = [];
      for (const score of data.scores) {
        const query = `
              INSERT INTO scores (score_id, result_set_id, gymnast_id, event_id, final_score, rank, tie)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (score_id) DO UPDATE SET final_score = EXCLUDED.final_score, rank = EXCLUDED.rank
              RETURNING score_id AS "scoreId", event_id AS "eventId", final_score AS "finalScore", rank, tie, gymnast_id;`;
        const res = await pool.query(query, [
          score.scoreId,
          score.resultSetId,
          score.personId,
          score.eventId,
          safeParseFloat(score.finalScore),
          score.rank,
          Boolean(score.tie),
        ]);
        savedScores.push(res.rows[0]);
      }
      console.log(`✅ Synced ${savedScores.length} scores.`);
      return savedScores;
    },
    syncSterlingGymData: async () => {
      console.log(
        'Starting Sterling Gym data sync for 2022-2023 season onwards...'
      );
      const response = await fetch(`https://api.myusagym.com/v1/meets/past`);
      const allPastMeets = (await response.json()) as ApiMeet[];

      const seasonStartDate = new Date('2022-09-01');
      const sterlingGymClubId = 24029;

      const meetsInDateRange = allPastMeets.filter((meet) => {
        const meetDate = new Date(meet.startDate);
        return meetDate >= seasonStartDate;
      });

      console.log(
        `Found ${meetsInDateRange.length} meets since ${
          seasonStartDate.toISOString().split('T')[0]
        }. Checking for Sterling Gym participation...`
      );

      const syncedSanctions = [];
      const client = await pool.connect();

      try {
        await client.query('BEGIN');
        for (const meet of meetsInDateRange) {
          console.log(
            `Checking sanction ${meet.sanctionId} (${meet.name}) for Sterling Gym participation...`
          );
          const sanctionDetailsResponse = await fetch(
            `https://api.myusagym.com/v2/sanctions/${meet.sanctionId}`
          );
          if (!sanctionDetailsResponse.ok) {
            console.warn(
              `-- Could not fetch details for sanction ${meet.sanctionId}. Status: ${sanctionDetailsResponse.status}`
            );
            continue; // Skip to the next meet
          }
          const sanctionData =
            (await sanctionDetailsResponse.json()) as ApiSanctionData;

          const clubIds = Object.keys(sanctionData.clubs || {});
          if (clubIds.includes(String(sterlingGymClubId))) {
            console.log(
              `-- Sterling Gym participated in ${meet.name}. Syncing...`
            );
            await syncSanctionInternal(meet.sanctionId, client);
            syncedSanctions.push({ sanctionId: meet.sanctionId });
          }
        }
        await client.query('COMMIT');

        console.log(
          `Finished sync. Synced ${syncedSanctions.length} total meets where Sterling Gym participated.`
        );

        if (syncedSanctions.length === 0) {
          return [];
        }

        const syncedSanctionIds = syncedSanctions.map((s) => s.sanctionId);
        const finalRes = await client.query(
          `
                SELECT sanction_id AS "sanctionId", name, start_date AS "startDate", end_date AS "endDate", city, state, site_name AS "siteName", meet_status, program_id
                FROM sanctions WHERE sanction_id = ANY($1::int[])`,
          [syncedSanctionIds]
        );
        return finalRes.rows;
      } catch (e) {
        await client.query('ROLLBACK');
        console.error('🔥 Full Sterling sync failed:', e);
        throw e;
      } finally {
        client.release();
      }
    },
  },

  // --- Field Resolvers for nested data ---
  Sanction: {
    program: (sanction) => mapProgramIdToEnum(sanction.program_id),
    meetStatus: (sanction) => sanction.meet_status,
    gymnasts: async (sanction) => {
      const res = await pool.query(
        `
            SELECT
                g.gymnast_id AS "gymnastId",
                g.first_name AS "firstName",
                g.last_name AS "lastName",
                g.gender,
                g.club_id,
                sg.club_id_for_meet
            FROM gymnasts g
            JOIN sanction_gymnasts sg ON g.gymnast_id = sg.gymnast_id
            WHERE sg.sanction_id = $1;
        `,
        [sanction.sanctionId]
      );
      return res.rows;
    },
    sessions: async (sanction) => {
      const res = await pool.query(
        'SELECT session_id AS "sessionId", sanction_id AS "sanctionId", name, session_date AS "sessionDate", program FROM sessions WHERE sanction_id = $1',
        [sanction.sanctionId]
      );
      return res.rows;
    },
  },
  Gymnast: {
    club: async (gymnast) => {
      if (!gymnast.club_id) return null;
      const res = await pool.query(
        'SELECT club_id AS "clubId", name, city, state FROM clubs WHERE club_id = $1',
        [gymnast.club_id]
      );
      return res.rows[0];
    },
    historicalClub: async (gymnast) => {
      if (!gymnast.club_id_for_meet) return null;
      const res = await pool.query(
        'SELECT club_id AS "clubId", name, city, state FROM clubs WHERE club_id = $1',
        [gymnast.club_id_for_meet]
      );
      return res.rows[0];
    },
  },
  Session: {
    resultSets: async (session) => {
      const res = await pool.query(
        'SELECT result_set_id AS "resultSetId", level, division FROM result_sets WHERE session_id = $1 AND sanction_id = $2',
        [session.sessionId, session.sanctionId]
      );
      return res.rows;
    },
  },
  ResultSet: {
    scores: async (resultSet) => {
      const res = await pool.query(
        'SELECT score_id AS "scoreId", event_id AS "eventId", final_score AS "finalScore", rank, tie, gymnast_id FROM scores WHERE result_set_id = $1',
        [resultSet.resultSetId]
      );
      return res.rows;
    },
  },
  Score: {
    gymnast: async (score) => {
      const res = await pool.query(
        'SELECT gymnast_id AS "gymnastId", first_name AS "firstName", last_name AS "lastName", gender, club_id FROM gymnasts WHERE gymnast_id = $1',
        [score.gymnast_id]
      );
      return res.rows[0];
    },
  },
};

// --- SERVER STARTUP ---
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Server ready at: ${url}`);
