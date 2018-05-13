// During Node bootstrap,
// will replace TypeScript baseUrl paths starting with ~
// by a valid relative path
const path = require('path');
const fs = require('fs');

(function() {
  const tsConfig = require('./tsconfig.json');
  const tsServerConfig = require('./tsconfig.server.json');
  const baseUrl = path.join(process.cwd(), tsConfig.compilerOptions.baseUrl);
  const buildUrl = path.join(
    process.cwd(),
    tsServerConfig.compilerOptions.outDir
  );

  const moduleProto = Object.getPrototypeOf(module);
  const origRequire = moduleProto.require;

  function rewriteName(name, isOriginal) {
    if (isOriginal) {
      return path.resolve(baseUrl, name);
    }
    return path.resolve(buildUrl, name);
  }

  moduleProto.require = function(name) {
    const isGraphQl = name.endsWith('.graphql');
    if (name[0] === '~') {
      name = rewriteName(name.slice(2), isGraphQl);
    }

    if (isGraphQl) {
      return fs.readFileSync(name).toString();
    }

    return origRequire.call(this, name);
  };
})();
