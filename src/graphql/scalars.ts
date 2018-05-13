import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { DateTime } from 'luxon';

function parseDate(value: string): DateTime | null {
  const date = DateTime.fromISO(value);
  if (!date.isValid) {
    throw new TypeError(date.invalidReason);
  }
  return date;
}

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: DateTime): string {
    return value.toISO();
  },
  parseValue(value): DateTime | null {
    if (typeof value === 'string') {
      return parseDate(value);
    }
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseDate(ast.value);
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

export default {
  DateTime: DateTimeScalar,
  Uuid: UuidScalar,
};
