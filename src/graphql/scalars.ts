import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { DateTime } from 'luxon';
import { Scalars } from '~/graphql/Resolvers';

// function parseDate(value: string): DateTime | null {
//   const date = DateTime.fromISO(value);
//   if (!date.isValid) {
//     throw new TypeError(date.invalidReason);
//   }
//   return date;
// }

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: string): string {
    return value;
  },
  parseValue(value): string | null {
    if (typeof value === 'string') {
      return value;
    }
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});

const uuidRegex = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;

function isUuid(value: string): boolean {
  return uuidRegex.test(value);
}

const UuidScalar = new GraphQLScalarType({
  name: 'Uuid',
  description: 'UUID custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return isUuid(value) ? value : null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING && isUuid(ast.value)) {
      return ast.value;
    }
    return null;
  },
});

const scalars: Scalars = {
  DateTime: DateTimeScalar,
  Uuid: UuidScalar,
};

export default scalars;
