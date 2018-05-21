import fs from 'fs';
import path from 'path';
import { printSchema } from 'graphql';
import { generate } from 'graphql-code-generator';
import schema from './schema';

const cwd = process.cwd();
const tsServerConfig = require(path.resolve(cwd, 'tsconfig.server.json'));
const buildPath = path.resolve(cwd, tsServerConfig.compilerOptions.outDir);
const buildGraphqlPath = path.join(buildPath, 'graphql');

const srcPath = path.resolve(cwd, 'src');
const graphqlPath = path.resolve(srcPath, 'graphql');

async function generateEverything() {
  createDir(buildPath);
  createDir(buildGraphqlPath);

  // Convert all .graphql files into a nice JS schema
  schema(graphqlPath, buildGraphqlPath);

  // Convert .graphql files to TS types
  await generate({
    schema: path.resolve(buildGraphqlPath, 'schema.js'),
    template: path.resolve(__dirname, 'types.ts'),
    out: srcPath,
    overwrite: true,
    args: [],
  });
}

function createDir(dirPath: string) {
  try {
    fs.mkdirSync(dirPath);
  } catch (e) {}
}

generateEverything();
