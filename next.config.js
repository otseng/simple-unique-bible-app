const { version } = require('./package.json');

module.exports = {
  publicRuntimeConfig: {
    version: process.env.npm_package_version
  },
  webpack(config) {
    // config.infrastructureLogging = { debug: /PackFileCache/ }
    return config;
  },
};