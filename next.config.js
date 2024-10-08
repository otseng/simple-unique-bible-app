const { version } = require('./package.json');

module.exports = {
  publicRuntimeConfig: {
    version: process.env.npm_package_version
  },
  webpack: (config, { dev, isServer }) => {
    // Remove any existing minification settings
    if (dev) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

const nextConfig = {
  webpack: (config, {isServer}) => {
      if (isServer) {
          config.devtool = 'source-map'
      }
      return config
  },
}