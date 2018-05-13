import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { DateTime } from 'luxon';

import Schema from '~/common/schema.graphql';
import Diving from '~/common/diving.graphql';
import Event from '~/common/event.graphql';
import Formation from '~/common/formation.graphql';
import Global from '~/common/global.graphql';
import Group from '~/common/group.graphql';
import User from '~/common/user.graphql';

import scalars from '~/graphql/scalars';

// The resolvers
const resolvers = {
  ...scalars,
  Query: {
    name() {
      return `asd`;
    },
  },
  Mutation: {
    login(username: string) {
      return true;
    },
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs: [Schema, Diving, Event, Formation, Group, User, Global],
  resolvers,
});

export default schema;
