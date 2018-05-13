const path = require('path');
const { getLoader, loaderNameMatches } = require('react-app-rewired');

const tsExtension = /\.(ts|tsx)$/;

module.exports = {
  webpack: function override(config, env) {
    config.resolve.extensions.push('.ts');
    config.resolve.extensions.push('.tsx');

    const fileRule = getLoader(config.module.rules, (rule) =>
      loaderNameMatches(rule, 'file-loader')
    );
    fileRule.exclude.push(tsExtension);

    const oneOfRule = config.module.rules.find(
      (rule) => rule.oneOf !== undefined
    );

    const appSrc = oneOfRule.oneOf.filter((r) => !!r.include)[0].include;

    oneOfRule.oneOf.unshift({
      test: tsExtension,
      include: appSrc,
      loader: require.resolve('ts-loader'),
      options: {
        // disable type checker - we will use it in fork plugin
        transpileOnly: true,
        configFile: './tsconfig.client.json'
      }
    });

    return config;
  }
};
