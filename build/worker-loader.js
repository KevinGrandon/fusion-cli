/* eslint-env node */

const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

module.exports = function() {};

module.exports.pitch = function(request) {
  this.addDependency(request);
  const entryFile = 'worker-[chunkhash].js';
  const compiler = createCompiler(this, request, {
    filename: entryFile,
  });
  runCompiler(compiler, this.async());
};

function runCompiler(compiler, callback) {
  compiler.runAsChild((error, entries) => {
    if (error) {
      callback(error);
    } else if (entries[0]) {
      var url = entries[0].files[0];
      callback(null, getSource(url));
    } else {
      callback(null, null);
    }
  });
}

function createCompiler(loader, request, options) {
  const compiler = getCompilation(loader).createChildCompiler('entry', options);
  const plugin = new SingleEntryPlugin(
    loader.context,
    '!!' + request,
    'worker'
  );
  compiler.apply(plugin);
  const subCache = 'workercache ' + __dirname + ' ' + request;
  compiler.hooks.compilation.tap('worker-loader-compilation', compilation => {
    if (!compilation.cache) {
      return;
    }
    if (!compilation.cache[subCache]) {
      compilation.cache[subCache] = {};
    }
    compilation.cache = compilation.cache[subCache];
  });
  return compiler;
}

function getSource(url) {
  return 'module.exports = __webpack_public_path__ + ' + JSON.stringify(url);
}

function getCompilation(loader) {
  return loader._compilation;
}
