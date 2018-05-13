const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const schemaPath = path.resolve(process.cwd(), 'src', 'graphql', 'schema.ts');

function compile(from: string, to: string) {
  const schemaSource = fs.readFileSync(from, { encoding: 'utf8' });

  // Replace .graphql imports by their real string value
  const tsSchemaSource = schemaSource.replace(
    /import ([a-zA-Z]+) from '([a-zA-Z\/~]+\.graphql)';/g,
    function(match: string, name: string, filePath: string) {
      return `const ${name} = \`${require(filePath)}\``;
    }
  );

  // Compile to JavaScript
  const jsSchemaSource = ts.transpileModule(tsSchemaSource, {
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
  fs.writeFileSync(to, '// @generated\n' + jsSchemaSource.outputText);
}

export default function generateSchema(fileName: string) {
  compile(schemaPath, fileName);
}
