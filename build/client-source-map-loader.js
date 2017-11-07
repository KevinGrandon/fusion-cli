/* eslint-env node */

// TODO: use loader config instead of singleton
// Probably have to do this via a loader configuration webpack plugin
const clientSourceMap = require('./client-source-map');

module.exports = function(/* content */) {
  // TODO: Can we do some caching?
  // Maybe split this loader in two and cache one of them.
  // Additionally, it'd be nice to cache the whole thing if our manifest has not changed at all
  this.cacheable(false);

  const done = this.async();
  clientSourceMap.get().then(manifest => {
    done(null, generateSource(manifest));
  });
};

function generateSource(manifest) {
  return `module.exports = new Map(${JSON.stringify(
    Array.from(manifest.entries())
  )});`;
}
