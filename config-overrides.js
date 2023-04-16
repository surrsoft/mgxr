const { lopPathsFind, ISARR } = require('./src/utils/lopPathsFind/lopPathsFind');
const { get: loGet } = require('lodash');

// см. [230402152100]

module.exports = function override(config, env) {
  const rules = config.module.rules;
  const lopPath = `${ISARR}.oneOf.${ISARR}.use.${ISARR}.loader`;
  const paths = lopPathsFind(rules, lopPath, (val) => {
    return val?.includes('resolve-url-loader');
  });
  paths.forEach(el => {
    const nPath = el.path.replace('.loader', '.options');
    const options = loGet(rules, nPath);
    options.removeCR = true;
  });

  return config;
};