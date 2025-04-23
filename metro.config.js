const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), {}));

module.exports = withNativeWind(config, {input: './src/assets/theme/global.css'});
