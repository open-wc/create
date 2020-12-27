import baseConfig from './web-dev-server.config.mjs';

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  files: 'test/**/*.test.js',

  /** Reuse options from Web Dev Server config  */
  nodeResolve: baseConfig.nodeResolve,
  plugins: [...baseConfig.plugins],
});
