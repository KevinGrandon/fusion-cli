/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-env node */

const {TestAppRuntime} = require('../build/test-runtime');

exports.run = async function(
  {
    dir = '.',
    debug,
    match,
    env,
    testFolder,
    configPath,
    // Allow snapshots to be updated using `-u` as well as --updateSnapshot.
    // We don't document this argument, but since jest output automatically
    // suggests this as a valid argument, we support it in case it's used.
    u,
    updateSnapshot,
    // Arguments which are passed through into jest
    ...rest
  } /*: any */
) {
  const jestArgs /*: any */ = {
    updateSnapshot: updateSnapshot || u || false,
  };
  const whitelistedJestOptions = [
    'changedFilesWithAncestor',
    'changedSince',
    'ci',
    'clearCache',
    'colors',
    'coverage',
    'detectOpenHandles',
    'errorOnDeprecated',
    'expand',
    'findRelatedTests',
    'json',
    'lastCommit',
    'listTests',
    'logHeapUsage',
    'noStackTrace',
    'notify',
    'onlyChanged',
    'passWithNoTests',
    'reporters',
    'showConfig',
    'silent',
    'testLocationInResults',
    'useStderr',
    'version',
    'watch',
    'watchAll',
    'watchman',
  ];
  whitelistedJestOptions.forEach(arg => {
    if (rest[arg]) {
      jestArgs[arg] = rest[arg];
    }
  });

  const testRuntime = new TestAppRuntime({
    dir,
    debug,
    match,
    env,
    testFolder,
    configPath,
    jestArgs,
  });

  // $FlowFixMe
  await testRuntime.run();

  return {
    stop() {
      // $FlowFixMe
      testRuntime.stop();
    },
  };
};
