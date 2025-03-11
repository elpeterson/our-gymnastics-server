import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Club = {
  __typename?: 'Club';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  clubId: Scalars['ID']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

export enum MeetStatus {
  Closed = 'Closed',
  Complete = 'Complete',
  Open = 'Open'
}

export type Person = {
  __typename?: 'Person';
  city?: Maybe<Scalars['String']['output']>;
  clubId?: Maybe<Scalars['ID']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  dob?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  personId: Scalars['ID']['output'];
  state?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

export enum ProgramType {
  AcrobaticAc = 'AcrobaticAC',
  Mens = 'Mens',
  Rhythmic = 'Rhythmic',
  TeamGym = 'TeamGym',
  Tumbling = 'Tumbling',
  Womens = 'Womens'
}

export type Query = {
  __typename?: 'Query';
  meet?: Maybe<Sanction>;
  meets: Array<Sanction>;
  meetsByDateRange: Array<Sanction>;
  meetsByProgram: Array<Sanction>;
  pastMeets: Array<Sanction>;
  sanction?: Maybe<Sanction>;
  score?: Maybe<Score>;
};


export type QueryMeetArgs = {
  sanctionId: Scalars['ID']['input'];
};


export type QueryMeetsByDateRangeArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeetsByProgramArgs = {
  program: ProgramType;
};


export type QuerySanctionArgs = {
  sanctionId: Scalars['ID']['input'];
};


export type QueryScoreArgs = {
  scoreId: Scalars['ID']['input'];
};

export type ResultSet = {
  __typename?: 'ResultSet';
  division: Scalars['String']['output'];
  level: Scalars['String']['output'];
  official: Scalars['Boolean']['output'];
  resultSetId: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  status?: Maybe<Scalars['String']['output']>;
};

export type Sanction = {
  __typename?: 'Sanction';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  apikey?: Maybe<Scalars['String']['output']>;
  bannerImageUrl?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  clubs: Array<Club>;
  disciplineTypeId: Scalars['Int']['output'];
  endDate: Scalars['String']['output'];
  feature?: Maybe<Scalars['String']['output']>;
  featuredEventId?: Maybe<Scalars['ID']['output']>;
  hidden: Scalars['Boolean']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  meetStatus: MeetStatus;
  name: Scalars['String']['output'];
  people: Array<Person>;
  program?: Maybe<ProgramType>;
  resultSets: Array<ResultSet>;
  sanctionId: Scalars['ID']['output'];
  scores: Array<Score>;
  sessions: Array<Session>;
  siteLink?: Maybe<Scalars['String']['output']>;
  siteName: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  state: Scalars['String']['output'];
  status: MeetStatus;
  time1?: Maybe<Scalars['String']['output']>;
  time2?: Maybe<Scalars['String']['output']>;
  time3?: Maybe<Scalars['String']['output']>;
  time4?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  vendorApiKey?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

export type Score = {
  __typename?: 'Score';
  attempt?: Maybe<Scalars['Int']['output']>;
  bibNumber: Scalars['Int']['output'];
  clubId: Scalars['ID']['output'];
  combinedScore?: Maybe<Scalars['Float']['output']>;
  combinedSession1Score?: Maybe<Scalars['Float']['output']>;
  combinedSession2Score?: Maybe<Scalars['Float']['output']>;
  combinedSession3Score?: Maybe<Scalars['Float']['output']>;
  combinedSessionId1?: Maybe<Scalars['ID']['output']>;
  combinedSessionId2?: Maybe<Scalars['ID']['output']>;
  combinedSessionId3?: Maybe<Scalars['ID']['output']>;
  combinedSessionId4?: Maybe<Scalars['ID']['output']>;
  deductions?: Maybe<Scalars['Float']['output']>;
  difficulty?: Maybe<Scalars['Float']['output']>;
  eventId: Scalars['String']['output'];
  execution?: Maybe<Scalars['Float']['output']>;
  finalScore: Scalars['Float']['output'];
  lastUpdate: Scalars['String']['output'];
  personId: Scalars['ID']['output'];
  place: Scalars['String']['output'];
  programId: ProgramType;
  rank: Scalars['Int']['output'];
  rankSort?: Maybe<Scalars['Int']['output']>;
  resultSetId: Scalars['ID']['output'];
  sanctionId: Scalars['ID']['output'];
  score1?: Maybe<Scalars['Float']['output']>;
  score2?: Maybe<Scalars['Float']['output']>;
  score3?: Maybe<Scalars['Float']['output']>;
  score4?: Maybe<Scalars['Float']['output']>;
  score5?: Maybe<Scalars['Float']['output']>;
  score6?: Maybe<Scalars['Float']['output']>;
  scoreId: Scalars['ID']['output'];
  sessionId: Scalars['String']['output'];
  sessionSort?: Maybe<Scalars['Int']['output']>;
  tie: Scalars['Boolean']['output'];
};

export type Session = {
  __typename?: 'Session';
  date: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  program?: Maybe<ProgramType>;
  sanctionId: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  squadA?: Maybe<Scalars['String']['output']>;
  squadB?: Maybe<Scalars['String']['output']>;
  squadC?: Maybe<Scalars['String']['output']>;
  squadD?: Maybe<Scalars['String']['output']>;
  squadE?: Maybe<Scalars['String']['output']>;
  squadF?: Maybe<Scalars['String']['output']>;
  squadG?: Maybe<Scalars['String']['output']>;
  squadH?: Maybe<Scalars['String']['output']>;
  squadI?: Maybe<Scalars['String']['output']>;
  time1?: Maybe<Scalars['String']['output']>;
  time2?: Maybe<Scalars['String']['output']>;
  time3?: Maybe<Scalars['String']['output']>;
  time4?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Club: ResolverTypeWrapper<Club>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MeetStatus: MeetStatus;
  Person: ResolverTypeWrapper<Person>;
  ProgramType: ProgramType;
  Query: ResolverTypeWrapper<{}>;
  ResultSet: ResolverTypeWrapper<ResultSet>;
  Sanction: ResolverTypeWrapper<Sanction>;
  Score: ResolverTypeWrapper<Score>;
  Session: ResolverTypeWrapper<Session>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Club: Club;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Person: Person;
  Query: {};
  ResultSet: ResultSet;
  Sanction: Sanction;
  Score: Score;
  Session: Session;
  String: Scalars['String']['output'];
};

export type ClubResolvers<ContextType = any, ParentType extends ResolversParentTypes['Club'] = ResolversParentTypes['Club']> = {
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clubId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fax?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clubId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dob?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  personId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  meet?: Resolver<Maybe<ResolversTypes['Sanction']>, ParentType, ContextType, RequireFields<QueryMeetArgs, 'sanctionId'>>;
  meets?: Resolver<Array<ResolversTypes['Sanction']>, ParentType, ContextType>;
  meetsByDateRange?: Resolver<Array<ResolversTypes['Sanction']>, ParentType, ContextType, Partial<QueryMeetsByDateRangeArgs>>;
  meetsByProgram?: Resolver<Array<ResolversTypes['Sanction']>, ParentType, ContextType, RequireFields<QueryMeetsByProgramArgs, 'program'>>;
  pastMeets?: Resolver<Array<ResolversTypes['Sanction']>, ParentType, ContextType>;
  sanction?: Resolver<Maybe<ResolversTypes['Sanction']>, ParentType, ContextType, RequireFields<QuerySanctionArgs, 'sanctionId'>>;
  score?: Resolver<Maybe<ResolversTypes['Score']>, ParentType, ContextType, RequireFields<QueryScoreArgs, 'scoreId'>>;
};

export type ResultSetResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResultSet'] = ResolversParentTypes['ResultSet']> = {
  division?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  official?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  resultSetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SanctionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sanction'] = ResolversParentTypes['Sanction']> = {
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  apikey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannerImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  clubs?: Resolver<Array<ResolversTypes['Club']>, ParentType, ContextType>;
  disciplineTypeId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  feature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  featuredEventId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  hidden?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meetStatus?: Resolver<ResolversTypes['MeetStatus'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  people?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType>;
  program?: Resolver<Maybe<ResolversTypes['ProgramType']>, ParentType, ContextType>;
  resultSets?: Resolver<Array<ResolversTypes['ResultSet']>, ParentType, ContextType>;
  sanctionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  scores?: Resolver<Array<ResolversTypes['Score']>, ParentType, ContextType>;
  sessions?: Resolver<Array<ResolversTypes['Session']>, ParentType, ContextType>;
  siteLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  siteName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MeetStatus'], ParentType, ContextType>;
  time1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time3?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time4?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vendorApiKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Score'] = ResolversParentTypes['Score']> = {
  attempt?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bibNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  clubId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  combinedScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  combinedSession1Score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  combinedSession2Score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  combinedSession3Score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  combinedSessionId1?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  combinedSessionId2?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  combinedSessionId3?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  combinedSessionId4?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  deductions?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  difficulty?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  eventId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  execution?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  finalScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastUpdate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  personId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  place?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  programId?: Resolver<ResolversTypes['ProgramType'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rankSort?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  resultSetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sanctionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  score1?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  score2?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  score3?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  score4?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  score5?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  score6?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  scoreId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sessionSort?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tie?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  program?: Resolver<Maybe<ResolversTypes['ProgramType']>, ParentType, ContextType>;
  sanctionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  squadA?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadB?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadC?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadD?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadE?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadF?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadG?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadH?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  squadI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time3?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time4?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Club?: ClubResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ResultSet?: ResultSetResolvers<ContextType>;
  Sanction?: SanctionResolvers<ContextType>;
  Score?: ScoreResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
};

