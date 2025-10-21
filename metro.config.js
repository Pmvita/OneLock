const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
  '@/components': path.resolve(__dirname, 'components'),
  '@/services': path.resolve(__dirname, 'services'),
  '@/utils': path.resolve(__dirname, 'utils'),
  '@/types': path.resolve(__dirname, 'types'),
  '@/constants': path.resolve(__dirname, 'constants'),
  '@/mockData': path.resolve(__dirname, 'mockData'),
};

module.exports = config;

