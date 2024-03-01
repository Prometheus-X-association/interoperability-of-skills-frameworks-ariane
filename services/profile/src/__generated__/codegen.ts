export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  _met?: Maybe<Met_Data>;
  addressOf?: Maybe<Array<PersonalDataWallet>>;
  city?: Maybe<Array<String_Xsd>>;
  country?: Maybe<Array<String_Xsd>>;
  geolocation?: Maybe<Array<GeoDataType_Mm>>;
  id: Scalars['ID']['output'];
  postalcode?: Maybe<Array<String_Xsd>>;
  state?: Maybe<Array<String_Xsd>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Address_CreateInput = {
  addressOf?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Array<String_Xsd_InputType>>;
  country?: InputMaybe<Array<String_Xsd_InputType>>;
  geolocation?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  postalcode?: InputMaybe<Array<String_Xsd_InputType>>;
  state?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Address_UpdateInput = {
  addressOf?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Array<String_Xsd_InputType>>;
  country?: InputMaybe<Array<String_Xsd_InputType>>;
  geolocation?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  postalcode?: InputMaybe<Array<String_Xsd_InputType>>;
  state?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Aptitude = {
  __typename?: 'Aptitude';
  _met?: Maybe<Met_Data>;
  habilitation?: Maybe<Array<Knowledge>>;
  id: Scalars['ID']['output'];
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Aptitude_CreateInput = {
  habilitation?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Aptitude_UpdateInput = {
  habilitation?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Beneficiary = {
  __typename?: 'Beneficiary';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Beneficiary_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Beneficiary_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Collection = {
  __typename?: 'Collection';
  _met?: Maybe<Met_Data>;
  id: Scalars['ID']['output'];
  member?: Maybe<Array<Collection_Member>>;
  memberOf?: Maybe<Array<Collection>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Collection_CreateInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  member?: InputMaybe<Array<Scalars['String']['input']>>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Collection_Member = Collection | Concept | Mission | User;

export type Collection_UpdateInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  member?: InputMaybe<Array<Scalars['String']['input']>>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Concept = {
  __typename?: 'Concept';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  memberOf?: Maybe<Array<Collection>>;
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Concept_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Concept_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Conditions = {
  __typename?: 'Conditions';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Conditions_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Conditions_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Contract = {
  __typename?: 'Contract';
  _met?: Maybe<Met_Data>;
  contractLengthUnit?: Maybe<Array<String_Xsd>>;
  contractLengthValue?: Maybe<Array<String_Xsd>>;
  contractType?: Maybe<Array<String_Xsd>>;
  id: Scalars['ID']['output'];
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  workTime?: Maybe<Array<String_Xsd>>;
};

export type Contract_CreateInput = {
  contractLengthUnit?: InputMaybe<Array<String_Xsd_InputType>>;
  contractLengthValue?: InputMaybe<Array<String_Xsd_InputType>>;
  contractType?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
  workTime?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Contract_UpdateInput = {
  contractLengthUnit?: InputMaybe<Array<String_Xsd_InputType>>;
  contractLengthValue?: InputMaybe<Array<String_Xsd_InputType>>;
  contractType?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
  workTime?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Date_Xsd = {
  __typename?: 'Date_xsd';
  value: Scalars['String']['output'];
};

export type Experience = {
  __typename?: 'Experience';
  _met?: Maybe<Met_Data>;
  duration?: Maybe<Array<String_Xsd>>;
  experienceOf?: Maybe<Array<User>>;
  id: Scalars['ID']['output'];
  occupation?: Maybe<Array<Experience_Occupation>>;
  title?: Maybe<Array<String_Xsd>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Experience_CreateInput = {
  duration?: InputMaybe<Array<String_Xsd_InputType>>;
  experienceOf?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  occupation?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Experience_Occupation = Job | Position;

export type Experience_UpdateInput = {
  duration?: InputMaybe<Array<String_Xsd_InputType>>;
  experienceOf?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  occupation?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Field = {
  __typename?: 'Field';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Field_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Field_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type GeoDataType_Mm = {
  __typename?: 'GeoDataType_mm';
  value: Scalars['String']['output'];
};

export type Goal = {
  __typename?: 'Goal';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Goal_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Goal_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Hours = {
  __typename?: 'Hours';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Hours_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Hours_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Job = {
  __typename?: 'Job';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  competence?: Maybe<Array<Job_Competence>>;
  id: Scalars['ID']['output'];
  memberOf?: Maybe<Array<Collection>>;
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Job_Competence = KnowHowDomain | Skill;

export type Job_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  competence?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Job_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  competence?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type KnowHowDomain = {
  __typename?: 'KnowHowDomain';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type KnowHowDomain_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type KnowHowDomain_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Knowledge = {
  __typename?: 'Knowledge';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type KnowledgeCategory = {
  __typename?: 'KnowledgeCategory';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type KnowledgeCategory_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type KnowledgeCategory_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Knowledge_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Knowledge_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Literal_Rdfs = {
  __typename?: 'Literal_rdfs';
  datatype?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  termType?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type Login = {
  __typename?: 'Login';
  accessToken?: Maybe<Scalars['String']['output']>;
};

export type Mission = {
  __typename?: 'Mission';
  _met?: Maybe<Met_Data>;
  agency?: Maybe<Array<Collection>>;
  area?: Maybe<Array<Concept>>;
  category?: Maybe<Array<String_Xsd>>;
  compatibilityScore?: Maybe<Array<String_Xsd>>;
  contract?: Maybe<Array<Contract>>;
  date?: Maybe<Array<Date_Xsd>>;
  description?: Maybe<Array<String_Xsd>>;
  id: Scalars['ID']['output'];
  job?: Maybe<Array<Concept>>;
  jobtype?: Maybe<Array<String_Xsd>>;
  matchingUsers?: Maybe<Array<User>>;
  missionAddress?: Maybe<Array<Address>>;
  notation?: Maybe<Array<String_Xsd>>;
  position?: Maybe<Array<Concept>>;
  priority?: Maybe<Array<String_Xsd>>;
  requirement?: Maybe<Array<MissionRequirement>>;
  sector?: Maybe<Array<Concept>>;
  title?: Maybe<Array<String_Xsd>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  url?: Maybe<Array<String_Xsd>>;
};

export type MissionRequirement = {
  __typename?: 'MissionRequirement';
  _met?: Maybe<Met_Data>;
  education?: Maybe<Array<String_Xsd>>;
  id: Scalars['ID']['output'];
  qualification?: Maybe<Array<Literal_Rdfs>>;
  studyLevel?: Maybe<Array<String_Xsd>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type MissionRequirement_CreateInput = {
  education?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  qualification?: InputMaybe<Array<String_Xsd_InputType>>;
  studyLevel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type MissionRequirement_UpdateInput = {
  education?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  qualification?: InputMaybe<Array<String_Xsd_InputType>>;
  studyLevel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Mission_CreateInput = {
  agency?: InputMaybe<Array<Scalars['String']['input']>>;
  area?: InputMaybe<Array<Scalars['String']['input']>>;
  category?: InputMaybe<Array<String_Xsd_InputType>>;
  compatibilityScore?: InputMaybe<Array<String_Xsd_InputType>>;
  contract?: InputMaybe<Array<Scalars['String']['input']>>;
  date?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  job?: InputMaybe<Array<Scalars['String']['input']>>;
  jobtype?: InputMaybe<Array<String_Xsd_InputType>>;
  matchingUsers?: InputMaybe<Array<Scalars['String']['input']>>;
  missionAddress?: InputMaybe<Array<Scalars['String']['input']>>;
  notation?: InputMaybe<Array<String_Xsd_InputType>>;
  position?: InputMaybe<Array<Scalars['String']['input']>>;
  priority?: InputMaybe<Array<String_Xsd_InputType>>;
  requirement?: InputMaybe<Array<Scalars['String']['input']>>;
  sector?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
  url?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Mission_UpdateInput = {
  agency?: InputMaybe<Array<Scalars['String']['input']>>;
  area?: InputMaybe<Array<Scalars['String']['input']>>;
  category?: InputMaybe<Array<String_Xsd_InputType>>;
  compatibilityScore?: InputMaybe<Array<String_Xsd_InputType>>;
  contract?: InputMaybe<Array<Scalars['String']['input']>>;
  date?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  job?: InputMaybe<Array<Scalars['String']['input']>>;
  jobtype?: InputMaybe<Array<String_Xsd_InputType>>;
  matchingUsers?: InputMaybe<Array<Scalars['String']['input']>>;
  missionAddress?: InputMaybe<Array<Scalars['String']['input']>>;
  notation?: InputMaybe<Array<String_Xsd_InputType>>;
  position?: InputMaybe<Array<Scalars['String']['input']>>;
  priority?: InputMaybe<Array<String_Xsd_InputType>>;
  requirement?: InputMaybe<Array<Scalars['String']['input']>>;
  sector?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
  url?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAddress?: Maybe<Array<Maybe<Address>>>;
  createAptitude?: Maybe<Array<Maybe<Aptitude>>>;
  createBeneficiary?: Maybe<Array<Maybe<Beneficiary>>>;
  createCollection?: Maybe<Array<Maybe<Collection>>>;
  createConcept?: Maybe<Array<Maybe<Concept>>>;
  createCondition?: Maybe<Array<Maybe<Conditions>>>;
  createContract?: Maybe<Array<Maybe<Contract>>>;
  createExperience?: Maybe<Array<Maybe<Experience>>>;
  createField?: Maybe<Array<Maybe<Field>>>;
  createGoal?: Maybe<Array<Maybe<Goal>>>;
  createHour?: Maybe<Array<Maybe<Hours>>>;
  createJob?: Maybe<Array<Maybe<Job>>>;
  createKnowHowDomain?: Maybe<Array<Maybe<KnowHowDomain>>>;
  createKnowledge?: Maybe<Array<Maybe<Knowledge>>>;
  createKnowledgeCategory?: Maybe<Array<Maybe<KnowledgeCategory>>>;
  createMission?: Maybe<Array<Maybe<Mission>>>;
  createMissionRequirement?: Maybe<Array<Maybe<MissionRequirement>>>;
  createPersonalDataWallet?: Maybe<Array<Maybe<PersonalDataWallet>>>;
  createPosition?: Maybe<Array<Maybe<Position>>>;
  createSearchedUser?: Maybe<Array<Maybe<SearchedUser>>>;
  createSector?: Maybe<Array<Maybe<Sector>>>;
  createSkill?: Maybe<Array<Maybe<Skill>>>;
  createSkillDomain?: Maybe<Array<Maybe<SkillDomain>>>;
  createSoftSkillDomain?: Maybe<Array<Maybe<SoftSkillDomain>>>;
  createStake?: Maybe<Array<Maybe<Stake>>>;
  createStructureType?: Maybe<Array<Maybe<StructureType>>>;
  createTravel?: Maybe<Array<Maybe<Travel>>>;
  createUser?: Maybe<Array<Maybe<User>>>;
  createWorkContext?: Maybe<Array<Maybe<WorkContext>>>;
  deleteAddress?: Maybe<Array<Maybe<Address>>>;
  deleteAptitude?: Maybe<Array<Maybe<Aptitude>>>;
  deleteBeneficiary?: Maybe<Array<Maybe<Beneficiary>>>;
  deleteCollection?: Maybe<Array<Maybe<Collection>>>;
  deleteConcept?: Maybe<Array<Maybe<Concept>>>;
  deleteCondition?: Maybe<Array<Maybe<Conditions>>>;
  deleteContract?: Maybe<Array<Maybe<Contract>>>;
  deleteExperience?: Maybe<Array<Maybe<Experience>>>;
  deleteField?: Maybe<Array<Maybe<Field>>>;
  deleteGoal?: Maybe<Array<Maybe<Goal>>>;
  deleteHour?: Maybe<Array<Maybe<Hours>>>;
  deleteJob?: Maybe<Array<Maybe<Job>>>;
  deleteKnowHowDomain?: Maybe<Array<Maybe<KnowHowDomain>>>;
  deleteKnowledge?: Maybe<Array<Maybe<Knowledge>>>;
  deleteKnowledgeCategory?: Maybe<Array<Maybe<KnowledgeCategory>>>;
  deleteMission?: Maybe<Array<Maybe<Mission>>>;
  deleteMissionRequirement?: Maybe<Array<Maybe<MissionRequirement>>>;
  deletePersonalDataWallet?: Maybe<Array<Maybe<PersonalDataWallet>>>;
  deletePosition?: Maybe<Array<Maybe<Position>>>;
  deleteSearchedUser?: Maybe<Array<Maybe<SearchedUser>>>;
  deleteSector?: Maybe<Array<Maybe<Sector>>>;
  deleteSkill?: Maybe<Array<Maybe<Skill>>>;
  deleteSkillDomain?: Maybe<Array<Maybe<SkillDomain>>>;
  deleteSoftSkillDomain?: Maybe<Array<Maybe<SoftSkillDomain>>>;
  deleteStake?: Maybe<Array<Maybe<Stake>>>;
  deleteStructureType?: Maybe<Array<Maybe<StructureType>>>;
  deleteTravel?: Maybe<Array<Maybe<Travel>>>;
  deleteUser?: Maybe<Array<Maybe<User>>>;
  deleteWorkContext?: Maybe<Array<Maybe<WorkContext>>>;
  updateAddress?: Maybe<Array<Maybe<Address>>>;
  updateAptitude?: Maybe<Array<Maybe<Aptitude>>>;
  updateBeneficiary?: Maybe<Array<Maybe<Beneficiary>>>;
  updateCollection?: Maybe<Array<Maybe<Collection>>>;
  updateConcept?: Maybe<Array<Maybe<Concept>>>;
  updateCondition?: Maybe<Array<Maybe<Conditions>>>;
  updateContract?: Maybe<Array<Maybe<Contract>>>;
  updateExperience?: Maybe<Array<Maybe<Experience>>>;
  updateField?: Maybe<Array<Maybe<Field>>>;
  updateGoal?: Maybe<Array<Maybe<Goal>>>;
  updateHour?: Maybe<Array<Maybe<Hours>>>;
  updateJob?: Maybe<Array<Maybe<Job>>>;
  updateKnowHowDomain?: Maybe<Array<Maybe<KnowHowDomain>>>;
  updateKnowledge?: Maybe<Array<Maybe<Knowledge>>>;
  updateKnowledgeCategory?: Maybe<Array<Maybe<KnowledgeCategory>>>;
  updateMission?: Maybe<Array<Maybe<Mission>>>;
  updateMissionRequirement?: Maybe<Array<Maybe<MissionRequirement>>>;
  updatePersonalDataWallet?: Maybe<Array<Maybe<PersonalDataWallet>>>;
  updatePosition?: Maybe<Array<Maybe<Position>>>;
  updateSearchedUser?: Maybe<Array<Maybe<SearchedUser>>>;
  updateSector?: Maybe<Array<Maybe<Sector>>>;
  updateSkill?: Maybe<Array<Maybe<Skill>>>;
  updateSkillDomain?: Maybe<Array<Maybe<SkillDomain>>>;
  updateSoftSkillDomain?: Maybe<Array<Maybe<SoftSkillDomain>>>;
  updateStake?: Maybe<Array<Maybe<Stake>>>;
  updateStructureType?: Maybe<Array<Maybe<StructureType>>>;
  updateTravel?: Maybe<Array<Maybe<Travel>>>;
  updateUser?: Maybe<Array<Maybe<User>>>;
  updateWorkContext?: Maybe<Array<Maybe<WorkContext>>>;
};


export type MutationCreateAddressArgs = {
  input?: InputMaybe<CreateAddressInput>;
};


export type MutationCreateAptitudeArgs = {
  input?: InputMaybe<CreateAptitudeInput>;
};


export type MutationCreateBeneficiaryArgs = {
  input?: InputMaybe<CreateBeneficiaryInput>;
};


export type MutationCreateCollectionArgs = {
  input?: InputMaybe<CreateCollectionInput>;
};


export type MutationCreateConceptArgs = {
  input?: InputMaybe<CreateConceptInput>;
};


export type MutationCreateConditionArgs = {
  input?: InputMaybe<CreateConditionInput>;
};


export type MutationCreateContractArgs = {
  input?: InputMaybe<CreateContractInput>;
};


export type MutationCreateExperienceArgs = {
  input?: InputMaybe<CreateExperienceInput>;
};


export type MutationCreateFieldArgs = {
  input?: InputMaybe<CreateFieldInput>;
};


export type MutationCreateGoalArgs = {
  input?: InputMaybe<CreateGoalInput>;
};


export type MutationCreateHourArgs = {
  input?: InputMaybe<CreateHourInput>;
};


export type MutationCreateJobArgs = {
  input?: InputMaybe<CreateJobInput>;
};


export type MutationCreateKnowHowDomainArgs = {
  input?: InputMaybe<CreateKnowHowDomainInput>;
};


export type MutationCreateKnowledgeArgs = {
  input?: InputMaybe<CreateKnowledgeInput>;
};


export type MutationCreateKnowledgeCategoryArgs = {
  input?: InputMaybe<CreateKnowledgeCategoryInput>;
};


export type MutationCreateMissionArgs = {
  input?: InputMaybe<CreateMissionInput>;
};


export type MutationCreateMissionRequirementArgs = {
  input?: InputMaybe<CreateMissionRequirementInput>;
};


export type MutationCreatePersonalDataWalletArgs = {
  input?: InputMaybe<CreatePersonalDataWalletInput>;
};


export type MutationCreatePositionArgs = {
  input?: InputMaybe<CreatePositionInput>;
};


export type MutationCreateSearchedUserArgs = {
  input?: InputMaybe<CreateSearchedUserInput>;
};


export type MutationCreateSectorArgs = {
  input?: InputMaybe<CreateSectorInput>;
};


export type MutationCreateSkillArgs = {
  input?: InputMaybe<CreateSkillInput>;
};


export type MutationCreateSkillDomainArgs = {
  input?: InputMaybe<CreateSkillDomainInput>;
};


export type MutationCreateSoftSkillDomainArgs = {
  input?: InputMaybe<CreateSoftSkillDomainInput>;
};


export type MutationCreateStakeArgs = {
  input?: InputMaybe<CreateStakeInput>;
};


export type MutationCreateStructureTypeArgs = {
  input?: InputMaybe<CreateStructureTypeInput>;
};


export type MutationCreateTravelArgs = {
  input?: InputMaybe<CreateTravelInput>;
};


export type MutationCreateUserArgs = {
  input?: InputMaybe<CreateUserInput>;
};


export type MutationCreateWorkContextArgs = {
  input?: InputMaybe<CreateWorkContextInput>;
};


export type MutationDeleteAddressArgs = {
  input?: InputMaybe<DeleteAddressInput>;
};


export type MutationDeleteAptitudeArgs = {
  input?: InputMaybe<DeleteAptitudeInput>;
};


export type MutationDeleteBeneficiaryArgs = {
  input?: InputMaybe<DeleteBeneficiaryInput>;
};


export type MutationDeleteCollectionArgs = {
  input?: InputMaybe<DeleteCollectionInput>;
};


export type MutationDeleteConceptArgs = {
  input?: InputMaybe<DeleteConceptInput>;
};


export type MutationDeleteConditionArgs = {
  input?: InputMaybe<DeleteConditionsInput>;
};


export type MutationDeleteContractArgs = {
  input?: InputMaybe<DeleteContractInput>;
};


export type MutationDeleteExperienceArgs = {
  input?: InputMaybe<DeleteExperienceInput>;
};


export type MutationDeleteFieldArgs = {
  input?: InputMaybe<DeleteFieldInput>;
};


export type MutationDeleteGoalArgs = {
  input?: InputMaybe<DeleteGoalInput>;
};


export type MutationDeleteHourArgs = {
  input?: InputMaybe<DeleteHoursInput>;
};


export type MutationDeleteJobArgs = {
  input?: InputMaybe<DeleteJobInput>;
};


export type MutationDeleteKnowHowDomainArgs = {
  input?: InputMaybe<DeleteKnowHowDomainInput>;
};


export type MutationDeleteKnowledgeArgs = {
  input?: InputMaybe<DeleteKnowledgeInput>;
};


export type MutationDeleteKnowledgeCategoryArgs = {
  input?: InputMaybe<DeleteKnowledgeCategoryInput>;
};


export type MutationDeleteMissionArgs = {
  input?: InputMaybe<DeleteMissionInput>;
};


export type MutationDeleteMissionRequirementArgs = {
  input?: InputMaybe<DeleteMissionRequirementInput>;
};


export type MutationDeletePersonalDataWalletArgs = {
  input?: InputMaybe<DeletePersonalDataWalletInput>;
};


export type MutationDeletePositionArgs = {
  input?: InputMaybe<DeletePositionInput>;
};


export type MutationDeleteSearchedUserArgs = {
  input?: InputMaybe<DeleteSearchedUserInput>;
};


export type MutationDeleteSectorArgs = {
  input?: InputMaybe<DeleteSectorInput>;
};


export type MutationDeleteSkillArgs = {
  input?: InputMaybe<DeleteSkillInput>;
};


export type MutationDeleteSkillDomainArgs = {
  input?: InputMaybe<DeleteSkillDomainInput>;
};


export type MutationDeleteSoftSkillDomainArgs = {
  input?: InputMaybe<DeleteSoftSkillDomainInput>;
};


export type MutationDeleteStakeArgs = {
  input?: InputMaybe<DeleteStakeInput>;
};


export type MutationDeleteStructureTypeArgs = {
  input?: InputMaybe<DeleteStructureTypeInput>;
};


export type MutationDeleteTravelArgs = {
  input?: InputMaybe<DeleteTravelInput>;
};


export type MutationDeleteUserArgs = {
  input?: InputMaybe<DeleteUserInput>;
};


export type MutationDeleteWorkContextArgs = {
  input?: InputMaybe<DeleteWorkContextInput>;
};


export type MutationUpdateAddressArgs = {
  input?: InputMaybe<UpdateAddressInput>;
};


export type MutationUpdateAptitudeArgs = {
  input?: InputMaybe<UpdateAptitudeInput>;
};


export type MutationUpdateBeneficiaryArgs = {
  input?: InputMaybe<UpdateBeneficiaryInput>;
};


export type MutationUpdateCollectionArgs = {
  input?: InputMaybe<UpdateCollectionInput>;
};


export type MutationUpdateConceptArgs = {
  input?: InputMaybe<UpdateConceptInput>;
};


export type MutationUpdateConditionArgs = {
  input?: InputMaybe<UpdateConditionInput>;
};


export type MutationUpdateContractArgs = {
  input?: InputMaybe<UpdateContractInput>;
};


export type MutationUpdateExperienceArgs = {
  input?: InputMaybe<UpdateExperienceInput>;
};


export type MutationUpdateFieldArgs = {
  input?: InputMaybe<UpdateFieldInput>;
};


export type MutationUpdateGoalArgs = {
  input?: InputMaybe<UpdateGoalInput>;
};


export type MutationUpdateHourArgs = {
  input?: InputMaybe<UpdateHourInput>;
};


export type MutationUpdateJobArgs = {
  input?: InputMaybe<UpdateJobInput>;
};


export type MutationUpdateKnowHowDomainArgs = {
  input?: InputMaybe<UpdateKnowHowDomainInput>;
};


export type MutationUpdateKnowledgeArgs = {
  input?: InputMaybe<UpdateKnowledgeInput>;
};


export type MutationUpdateKnowledgeCategoryArgs = {
  input?: InputMaybe<UpdateKnowledgeCategoryInput>;
};


export type MutationUpdateMissionArgs = {
  input?: InputMaybe<UpdateMissionInput>;
};


export type MutationUpdateMissionRequirementArgs = {
  input?: InputMaybe<UpdateMissionRequirementInput>;
};


export type MutationUpdatePersonalDataWalletArgs = {
  input?: InputMaybe<UpdatePersonalDataWalletInput>;
};


export type MutationUpdatePositionArgs = {
  input?: InputMaybe<UpdatePositionInput>;
};


export type MutationUpdateSearchedUserArgs = {
  input?: InputMaybe<UpdateSearchedUserInput>;
};


export type MutationUpdateSectorArgs = {
  input?: InputMaybe<UpdateSectorInput>;
};


export type MutationUpdateSkillArgs = {
  input?: InputMaybe<UpdateSkillInput>;
};


export type MutationUpdateSkillDomainArgs = {
  input?: InputMaybe<UpdateSkillDomainInput>;
};


export type MutationUpdateSoftSkillDomainArgs = {
  input?: InputMaybe<UpdateSoftSkillDomainInput>;
};


export type MutationUpdateStakeArgs = {
  input?: InputMaybe<UpdateStakeInput>;
};


export type MutationUpdateStructureTypeArgs = {
  input?: InputMaybe<UpdateStructureTypeInput>;
};


export type MutationUpdateTravelArgs = {
  input?: InputMaybe<UpdateTravelInput>;
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUserInput>;
};


export type MutationUpdateWorkContextArgs = {
  input?: InputMaybe<UpdateWorkContextInput>;
};

export type PersonalDataWallet = {
  __typename?: 'PersonalDataWallet';
  _met?: Maybe<Met_Data>;
  certification?: Maybe<Array<Knowledge>>;
  email?: Maybe<Array<String_Xsd>>;
  family?: Maybe<Array<String_Xsd>>;
  given?: Maybe<Array<String_Xsd>>;
  id: Scalars['ID']['output'];
  location?: Maybe<Array<Address>>;
  personalDataOf?: Maybe<Array<User>>;
  preferredDistance?: Maybe<Array<String_Xsd>>;
  searchedUser?: Maybe<Array<SearchedUser>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type PersonalDataWallet_CreateInput = {
  certification?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Array<String_Xsd_InputType>>;
  family?: InputMaybe<Array<String_Xsd_InputType>>;
  given?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  location?: InputMaybe<Array<Scalars['String']['input']>>;
  personalDataOf?: InputMaybe<Array<Scalars['String']['input']>>;
  preferredDistance?: InputMaybe<Array<String_Xsd_InputType>>;
  searchedUser?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type PersonalDataWallet_UpdateInput = {
  certification?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Array<String_Xsd_InputType>>;
  family?: InputMaybe<Array<String_Xsd_InputType>>;
  given?: InputMaybe<Array<String_Xsd_InputType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  location?: InputMaybe<Array<Scalars['String']['input']>>;
  personalDataOf?: InputMaybe<Array<Scalars['String']['input']>>;
  preferredDistance?: InputMaybe<Array<String_Xsd_InputType>>;
  searchedUser?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Position = {
  __typename?: 'Position';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Position_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Position_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Query = {
  __typename?: 'Query';
  Address?: Maybe<Array<Address>>;
  Aptitude?: Maybe<Array<Aptitude>>;
  Collection?: Maybe<Array<Collection>>;
  Concept?: Maybe<Array<Concept>>;
  Experience?: Maybe<Array<Experience>>;
  Login?: Maybe<Login>;
  PersonalDataWallet?: Maybe<Array<PersonalDataWallet>>;
  ResetPassword?: Maybe<ResetPassword>;
  SearchedUser?: Maybe<Array<SearchedUser>>;
  ServeAddviseo?: Maybe<ServeAddviseo>;
  SignUp?: Maybe<SignUp>;
  User?: Maybe<Array<User>>;
  missionsProman?: Maybe<Group_MissionsProman_Data>;
  rome?: Maybe<Group_Rome_Data>;
};


export type QueryAddressArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryAptitudeArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryCollectionArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryConceptArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryExperienceArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type QueryPersonalDataWalletArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryResetPasswordArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};


export type QuerySearchedUserArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryServeAddviseoArgs = {
  customer_token?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  resource_type?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySignUpArgs = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type QueryUserArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryMissionsPromanArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type QueryRomeArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};

export type ResetPassword = {
  __typename?: 'ResetPassword';
  accessToken?: Maybe<Scalars['String']['output']>;
};

export type SearchedUser = {
  __typename?: 'SearchedUser';
  _met?: Maybe<Met_Data>;
  id: Scalars['ID']['output'];
  searchedUserOf?: Maybe<Array<User>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type SearchedUser_CreateInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  searchedUserOf?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type SearchedUser_UpdateInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  searchedUserOf?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Sector = {
  __typename?: 'Sector';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Sector_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Sector_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type ServeAddviseo = {
  __typename?: 'ServeAddviseo';
  accessLink?: Maybe<Scalars['String']['output']>;
};

export type SignUp = {
  __typename?: 'SignUp';
  accessToken?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type Skill = {
  __typename?: 'Skill';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type SkillDomain = {
  __typename?: 'SkillDomain';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type SkillDomain_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type SkillDomain_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Skill_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Skill_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type SoftSkillDomain = {
  __typename?: 'SoftSkillDomain';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type SoftSkillDomain_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type SoftSkillDomain_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Stake = {
  __typename?: 'Stake';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Stake_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Stake_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type String_Xsd = {
  __typename?: 'String_xsd';
  value: Scalars['String']['output'];
};

export type String_Xsd_InputType = {
  language?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type StructureType = {
  __typename?: 'StructureType';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type StructureType_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type StructureType_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Travel = {
  __typename?: 'Travel';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Travel_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type Travel_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type User = {
  __typename?: 'User';
  _met?: Maybe<Met_Data>;
  aptitude?: Maybe<Array<Aptitude>>;
  availableFrom?: Maybe<Array<Date_Xsd>>;
  experience?: Maybe<Array<Experience>>;
  favoriteMissions?: Maybe<Array<Mission>>;
  id: Scalars['ID']['output'];
  keycloakId?: Maybe<Array<String_Xsd>>;
  matchingMissions?: Maybe<Array<Mission>>;
  memberOf?: Maybe<Array<Collection>>;
  personalData?: Maybe<Array<PersonalDataWallet>>;
  searchedUser?: Maybe<Array<SearchedUser>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  workingHour?: Maybe<Array<Hours>>;
};

export type User_CreateInput = {
  aptitude?: InputMaybe<Array<Scalars['String']['input']>>;
  availableFrom?: InputMaybe<Array<Scalars['String']['input']>>;
  experience?: InputMaybe<Array<Scalars['String']['input']>>;
  favoriteMissions?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  keycloakId?: InputMaybe<Array<String_Xsd_InputType>>;
  matchingMissions?: InputMaybe<Array<Scalars['String']['input']>>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  personalData?: InputMaybe<Array<Scalars['String']['input']>>;
  searchedUser?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
  workingHour?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type User_UpdateInput = {
  aptitude?: InputMaybe<Array<Scalars['String']['input']>>;
  availableFrom?: InputMaybe<Array<Scalars['String']['input']>>;
  experience?: InputMaybe<Array<Scalars['String']['input']>>;
  favoriteMissions?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  keycloakId?: InputMaybe<Array<String_Xsd_InputType>>;
  matchingMissions?: InputMaybe<Array<Scalars['String']['input']>>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  personalData?: InputMaybe<Array<Scalars['String']['input']>>;
  searchedUser?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
  workingHour?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type WorkContext = {
  __typename?: 'WorkContext';
  _met?: Maybe<Met_Data>;
  broader?: Maybe<Array<Concept>>;
  id: Scalars['ID']['output'];
  narrower?: Maybe<Array<Concept>>;
  prefLabel?: Maybe<Array<Literal_Rdfs>>;
  type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type WorkContext_CreateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type WorkContext_UpdateInput = {
  broader?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  narrower?: InputMaybe<Array<Scalars['String']['input']>>;
  prefLabel?: InputMaybe<Array<String_Xsd_InputType>>;
  type?: InputMaybe<Array<String_Xsd_InputType>>;
};

export type AggregateFieldType = {
  fields?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ranges?: InputMaybe<Array<InputMaybe<AggregationRangeInput>>>;
};

export type AggregateInput = {
  avg?: InputMaybe<AggregateFieldType>;
  ranges?: InputMaybe<AggregateFieldType>;
  terms?: InputMaybe<AggregateFieldType>;
};

export type AggregationFieldReturnType = {
  __typename?: 'aggregationFieldReturnType';
  key?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type AggregationRangeInput = {
  from?: InputMaybe<Scalars['Float']['input']>;
  to?: InputMaybe<Scalars['Float']['input']>;
};

export type AggregationReturnType = {
  __typename?: 'aggregationReturnType';
  avg?: Maybe<Array<Maybe<AggregationFieldReturnType>>>;
  ranges?: Maybe<Array<Maybe<AggregationFieldReturnType>>>;
  terms?: Maybe<Array<Maybe<AggregationFieldReturnType>>>;
};

export type CreateAddressInput = {
  bulk?: InputMaybe<Array<Address_CreateInput>>;
  data?: InputMaybe<Address_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateAptitudeInput = {
  bulk?: InputMaybe<Array<Aptitude_CreateInput>>;
  data?: InputMaybe<Aptitude_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateBeneficiaryInput = {
  bulk?: InputMaybe<Array<Beneficiary_CreateInput>>;
  data?: InputMaybe<Beneficiary_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateCollectionInput = {
  bulk?: InputMaybe<Array<Collection_CreateInput>>;
  data?: InputMaybe<Collection_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateConceptInput = {
  bulk?: InputMaybe<Array<Concept_CreateInput>>;
  data?: InputMaybe<Concept_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateConditionInput = {
  bulk?: InputMaybe<Array<Conditions_CreateInput>>;
  data?: InputMaybe<Conditions_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateContractInput = {
  bulk?: InputMaybe<Array<Contract_CreateInput>>;
  data?: InputMaybe<Contract_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateExperienceInput = {
  bulk?: InputMaybe<Array<Experience_CreateInput>>;
  data?: InputMaybe<Experience_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateFieldInput = {
  bulk?: InputMaybe<Array<Field_CreateInput>>;
  data?: InputMaybe<Field_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateGoalInput = {
  bulk?: InputMaybe<Array<Goal_CreateInput>>;
  data?: InputMaybe<Goal_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateHourInput = {
  bulk?: InputMaybe<Array<Hours_CreateInput>>;
  data?: InputMaybe<Hours_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateJobInput = {
  bulk?: InputMaybe<Array<Job_CreateInput>>;
  data?: InputMaybe<Job_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateKnowHowDomainInput = {
  bulk?: InputMaybe<Array<KnowHowDomain_CreateInput>>;
  data?: InputMaybe<KnowHowDomain_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateKnowledgeCategoryInput = {
  bulk?: InputMaybe<Array<KnowledgeCategory_CreateInput>>;
  data?: InputMaybe<KnowledgeCategory_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateKnowledgeInput = {
  bulk?: InputMaybe<Array<Knowledge_CreateInput>>;
  data?: InputMaybe<Knowledge_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateMissionInput = {
  bulk?: InputMaybe<Array<Mission_CreateInput>>;
  data?: InputMaybe<Mission_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateMissionRequirementInput = {
  bulk?: InputMaybe<Array<MissionRequirement_CreateInput>>;
  data?: InputMaybe<MissionRequirement_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreatePersonalDataWalletInput = {
  bulk?: InputMaybe<Array<PersonalDataWallet_CreateInput>>;
  data?: InputMaybe<PersonalDataWallet_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreatePositionInput = {
  bulk?: InputMaybe<Array<Position_CreateInput>>;
  data?: InputMaybe<Position_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateSearchedUserInput = {
  bulk?: InputMaybe<Array<SearchedUser_CreateInput>>;
  data?: InputMaybe<SearchedUser_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateSectorInput = {
  bulk?: InputMaybe<Array<Sector_CreateInput>>;
  data?: InputMaybe<Sector_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateSkillDomainInput = {
  bulk?: InputMaybe<Array<SkillDomain_CreateInput>>;
  data?: InputMaybe<SkillDomain_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateSkillInput = {
  bulk?: InputMaybe<Array<Skill_CreateInput>>;
  data?: InputMaybe<Skill_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateSoftSkillDomainInput = {
  bulk?: InputMaybe<Array<SoftSkillDomain_CreateInput>>;
  data?: InputMaybe<SoftSkillDomain_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateStakeInput = {
  bulk?: InputMaybe<Array<Stake_CreateInput>>;
  data?: InputMaybe<Stake_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateStructureTypeInput = {
  bulk?: InputMaybe<Array<StructureType_CreateInput>>;
  data?: InputMaybe<StructureType_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateTravelInput = {
  bulk?: InputMaybe<Array<Travel_CreateInput>>;
  data?: InputMaybe<Travel_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateUserInput = {
  bulk?: InputMaybe<Array<User_CreateInput>>;
  data?: InputMaybe<User_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type CreateWorkContextInput = {
  bulk?: InputMaybe<Array<WorkContext_CreateInput>>;
  data?: InputMaybe<WorkContext_CreateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteAddressInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteAptitudeInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteBeneficiaryInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteCollectionInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteConceptInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteConditionsInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteContractInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteExperienceInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteFieldInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteGoalInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteHoursInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteJobInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteKnowHowDomainInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteKnowledgeCategoryInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteKnowledgeInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteMissionInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteMissionRequirementInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeletePersonalDataWalletInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeletePositionInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteSearchedUserInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteSectorInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteSkillDomainInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteSkillInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteSoftSkillDomainInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteStakeInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteStructureTypeInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteTravelInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteUserInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type DeleteWorkContextInput = {
  where?: InputMaybe<Refine_Where_Locator>;
};

export type Group_Employment_Data = {
  __typename?: 'group_employment_data';
  Field?: Maybe<Array<Field>>;
  Job?: Maybe<Array<Job>>;
  Position?: Maybe<Array<Position>>;
  Sector?: Maybe<Array<Sector>>;
};

export type Group_MissionsProman_Data = {
  __typename?: 'group_missionsProman_data';
  Contract?: Maybe<Array<Contract>>;
  Mission?: Maybe<Array<Mission>>;
  MissionRequirement?: Maybe<Array<MissionRequirement>>;
};

export type Group_Rome_Data = {
  __typename?: 'group_rome_data';
  employment?: Maybe<Group_Employment_Data>;
  skills?: Maybe<Group_Skills_Data>;
  workConditions?: Maybe<Group_WorkConditions_Data>;
};


export type Group_Rome_DataEmploymentArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type Group_Rome_DataSkillsArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};


export type Group_Rome_DataWorkConditionsArgs = {
  aggFields?: InputMaybe<AggregateInput>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  pagination?: InputMaybe<PaginationInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  queryVector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  searchField?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sort?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};

export type Group_Skills_Data = {
  __typename?: 'group_skills_data';
  Goal?: Maybe<Array<Goal>>;
  KnowHowDomain?: Maybe<Array<KnowHowDomain>>;
  Knowledge?: Maybe<Array<Knowledge>>;
  KnowledgeCategory?: Maybe<Array<KnowledgeCategory>>;
  Skill?: Maybe<Array<Skill>>;
  SkillDomain?: Maybe<Array<SkillDomain>>;
  SoftSkillDomain?: Maybe<Array<SoftSkillDomain>>;
  Stake?: Maybe<Array<Stake>>;
};

export type Group_WorkConditions_Data = {
  __typename?: 'group_workConditions_data';
  Beneficiary?: Maybe<Array<Beneficiary>>;
  Conditions?: Maybe<Array<Conditions>>;
  Hours?: Maybe<Array<Hours>>;
  StructureType?: Maybe<Array<StructureType>>;
  Travel?: Maybe<Array<Travel>>;
  WorkContext?: Maybe<Array<WorkContext>>;
};

export type Met_Data = {
  __typename?: 'met_data';
  aggregate?: Maybe<AggregationReturnType>;
  pagination?: Maybe<PaginationReturnType>;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export type PaginationReturnType = {
  __typename?: 'paginationReturnType';
  limit?: Maybe<Scalars['Int']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPage?: Maybe<Scalars['Int']['output']>;
};

export type Refine_Where_Locator = {
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type UpdateAddressInput = {
  bulk?: InputMaybe<Array<Address_UpdateInput>>;
  data?: InputMaybe<Address_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateAptitudeInput = {
  bulk?: InputMaybe<Array<Aptitude_UpdateInput>>;
  data?: InputMaybe<Aptitude_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateBeneficiaryInput = {
  bulk?: InputMaybe<Array<Beneficiary_UpdateInput>>;
  data?: InputMaybe<Beneficiary_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateCollectionInput = {
  bulk?: InputMaybe<Array<Collection_UpdateInput>>;
  data?: InputMaybe<Collection_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateConceptInput = {
  bulk?: InputMaybe<Array<Concept_UpdateInput>>;
  data?: InputMaybe<Concept_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateConditionInput = {
  bulk?: InputMaybe<Array<Conditions_UpdateInput>>;
  data?: InputMaybe<Conditions_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateContractInput = {
  bulk?: InputMaybe<Array<Contract_UpdateInput>>;
  data?: InputMaybe<Contract_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateExperienceInput = {
  bulk?: InputMaybe<Array<Experience_UpdateInput>>;
  data?: InputMaybe<Experience_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateFieldInput = {
  bulk?: InputMaybe<Array<Field_UpdateInput>>;
  data?: InputMaybe<Field_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateGoalInput = {
  bulk?: InputMaybe<Array<Goal_UpdateInput>>;
  data?: InputMaybe<Goal_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateHourInput = {
  bulk?: InputMaybe<Array<Hours_UpdateInput>>;
  data?: InputMaybe<Hours_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateJobInput = {
  bulk?: InputMaybe<Array<Job_UpdateInput>>;
  data?: InputMaybe<Job_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateKnowHowDomainInput = {
  bulk?: InputMaybe<Array<KnowHowDomain_UpdateInput>>;
  data?: InputMaybe<KnowHowDomain_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateKnowledgeCategoryInput = {
  bulk?: InputMaybe<Array<KnowledgeCategory_UpdateInput>>;
  data?: InputMaybe<KnowledgeCategory_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateKnowledgeInput = {
  bulk?: InputMaybe<Array<Knowledge_UpdateInput>>;
  data?: InputMaybe<Knowledge_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateMissionInput = {
  bulk?: InputMaybe<Array<Mission_UpdateInput>>;
  data?: InputMaybe<Mission_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateMissionRequirementInput = {
  bulk?: InputMaybe<Array<MissionRequirement_UpdateInput>>;
  data?: InputMaybe<MissionRequirement_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdatePersonalDataWalletInput = {
  bulk?: InputMaybe<Array<PersonalDataWallet_UpdateInput>>;
  data?: InputMaybe<PersonalDataWallet_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdatePositionInput = {
  bulk?: InputMaybe<Array<Position_UpdateInput>>;
  data?: InputMaybe<Position_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateSearchedUserInput = {
  bulk?: InputMaybe<Array<SearchedUser_UpdateInput>>;
  data?: InputMaybe<SearchedUser_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateSectorInput = {
  bulk?: InputMaybe<Array<Sector_UpdateInput>>;
  data?: InputMaybe<Sector_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateSkillDomainInput = {
  bulk?: InputMaybe<Array<SkillDomain_UpdateInput>>;
  data?: InputMaybe<SkillDomain_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateSkillInput = {
  bulk?: InputMaybe<Array<Skill_UpdateInput>>;
  data?: InputMaybe<Skill_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateSoftSkillDomainInput = {
  bulk?: InputMaybe<Array<SoftSkillDomain_UpdateInput>>;
  data?: InputMaybe<SoftSkillDomain_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateStakeInput = {
  bulk?: InputMaybe<Array<Stake_UpdateInput>>;
  data?: InputMaybe<Stake_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateStructureTypeInput = {
  bulk?: InputMaybe<Array<StructureType_UpdateInput>>;
  data?: InputMaybe<StructureType_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateTravelInput = {
  bulk?: InputMaybe<Array<Travel_UpdateInput>>;
  data?: InputMaybe<Travel_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateUserInput = {
  bulk?: InputMaybe<Array<User_UpdateInput>>;
  data?: InputMaybe<User_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};

export type UpdateWorkContextInput = {
  bulk?: InputMaybe<Array<WorkContext_UpdateInput>>;
  data?: InputMaybe<WorkContext_UpdateInput>;
  where?: InputMaybe<Refine_Where_Locator>;
};
