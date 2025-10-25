const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configuration pour exclure react-native-pdf sur web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Exclure react-native-pdf sur web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = withNativeWind(config, { input: './global.css' });
