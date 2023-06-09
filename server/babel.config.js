const appEnvConfig = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
  targets: {
    chrome: '50',
  },
};

module.exports = {
  env: {
    test: appEnvConfig,
    development: appEnvConfig,
    production: appEnvConfig,
  },
};
