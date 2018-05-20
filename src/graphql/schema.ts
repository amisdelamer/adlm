import fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

// Should be that but cannot make TS happy with it...
// import Schema from '~/graphql/schema.graphql';
// import Diving from '~/graphql/diving.graphql';
// import Event from '~/graphql/event.graphql';
// import Formation from '~/graphql/formation.graphql';
// import Global from '~/graphql/global.graphql';
// import Group from '~/graphql/group.graphql';
// import User from '~/graphql/user.graphql';

function loadGraphQL(path: string): string {
  return fs.readFileSync(path, 'utf8');
}

const Schema = loadGraphQL(process.cwd() + '/src/graphql/schema.graphql');
const Diving = loadGraphQL(process.cwd() + '/src/graphql/diving.graphql');
const Event = loadGraphQL(process.cwd() + '/src/graphql/event.graphql');
const Formation = loadGraphQL(process.cwd() + '/src/graphql/formation.graphql');
const Global = loadGraphQL(process.cwd() + '/src/graphql/global.graphql');
const Group = loadGraphQL(process.cwd() + '/src/graphql/group.graphql');
const User = loadGraphQL(process.cwd() + '/src/graphql/user.graphql');

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs: [Schema, Diving, Event, Formation, Group, User, Global],
  allowUndefinedInResolve: false,
  resolverValidationOptions: {
    // We are adding the resolvers later on
    requireResolversForResolveType: false,
  },
});

export default schema;
