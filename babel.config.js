module.exports = function (api) {
  api.cache(true);
  const plugins = ['react-native-paper/babel', 'react-native-reanimated/plugin'];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: ['react-native-reanimated/plugin'],
// };
