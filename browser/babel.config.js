module.exports = function(api) {
  api.cache.never()
  return {
    presets: [['@babel/preset-env', { targets: { esmodules: true } }], '@babel/preset-react'],
    plugins: ['@babel/plugin-proposal-object-rest-spread'],
  }
}
