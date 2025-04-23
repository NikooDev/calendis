module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx'],
        alias: {
          '@Calendis': './src'
        }
      }
    ]
  ,'react-native-reanimated/plugin']
};
