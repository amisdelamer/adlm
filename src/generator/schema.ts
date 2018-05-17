import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const cwd = process.cwd();
const tsServerConfig = require(path.resolve(cwd, 'tsconfig.server.json'));
const buildPath = path.resolve(cwd, tsServerConfig.compilerOptions.outDir);
const buildGraphqlPath = path.join(buildPath, 'graphql');
const graphqlPath = path.resolve(process.cwd(), 'src', 'graphql');

function compile(from: string, to: string) {
  const source = fs.readFileSync(from, { encoding: 'utf8' });

  // Replace .graphql imports by their real string value
  const tsSource = source.replace(
    /import ([a-zA-Z]+) from '([a-zA-Z\/~]+\.graphql)';/g,
    function(match: string, name: string, filePath: string) {
      return `const ${name} = \`${require(filePath)}\``;
    }
  );

  // Compile to JavaScript
  const jsSource = ts.transpileModule(tsSource, {
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      strict: true,
      alwaysStrict: true,
      forceConsistentCasingInFileNames: true,
      noImplicitReturns: true,
      noImplicitThis: true,
      noImplicitAny: true,
      strictFunctionTypes: true,
      strictPropertyInitialization: true,
      strictNullChecks: true,
      suppressImplicitAnyIndexErrors: true,
      noUnusedLocals: true,
    },
  });

  // Output file
  fs.writeFileSync(to, '// @generated\n' + jsSource.outputText);
}

function createDir(dirPath: string) {
  try {
    fs.mkdirSync(dirPath);
  } catch (e) {}
}

export default function generateSchema(fileName: string) {
  createDir(buildPath);
  createDir(buildGraphqlPath);
  fs
    .readdirSync(graphqlPath)
    .filter((f) => f.endsWith('.ts'))
    .forEach((f) => {
      compile(
        path.resolve(graphqlPath, f),
        path.resolve(buildGraphqlPath, f.replace('.ts', '.js'))
      );
    });
}
