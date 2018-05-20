import fs from 'fs';
import path from 'path';
import ts from 'typescript';

function compile(from: string, to: string) {
  const source = fs.readFileSync(from, { encoding: 'utf8' });

  // Replace .graphql imports by their real string value
  const tsSource = source.replace(
    /\nimport ([a-zA-Z]+) from '([a-zA-Z\/~]+\.graphql)';/g,
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

export default function generateSchema(from: string, to: string) {
  fs
    .readdirSync(from)
    .filter((f) => f.endsWith('.ts'))
    .forEach((f) => {
      compile(path.resolve(from, f), path.resolve(to, f.replace('.ts', '.js')));
    });
}
