module.exports = function (api) {
  api.cache(true)
  return {
    // Reanimated 4 / worklets Babel eklentisini babel-preset-expo kendisi ekliyor;
    // burada ayrıca 'react-native-reanimated/plugin' yazmak eklentiyi iki kez çalıştırır.
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
  }
}
