import path from 'path';
import fs from 'fs';
import { printSchema } from 'graphql';
import { generate } from 'graphql-code-generator';
import schema from './schema';
import db from './db';

const SRC_PATH = path.resolve(process.cwd(), 'src');
const SCHEMA_PATH = path.resolve(SRC_PATH, 'graphql', 'schema.graphql.js');

// Convert all .graphql files into a nice JS schema
schema(SCHEMA_PATH);

// Read real DB and generate TS types from it
db();

// Convert .graphql files to TS types
generate({
  schema: SCHEMA_PATH,
  template: path.resolve(__dirname, 'types.ts'),
  out: path.resolve(SRC_PATH, 'common'),
  overwrite: true,
  args: [],
});
