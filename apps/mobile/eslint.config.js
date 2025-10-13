// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@expo/vector-icons',
              message: 'Utilise AppIcon (lucide-react-native).',
            },
            {
              name: 'react-native-vector-icons',
              message: 'Utilise AppIcon (lucide-react-native).',
            },
          ],
        },
      ],
    },
  },
]);
