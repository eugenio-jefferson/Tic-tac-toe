const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
   transformIgnorePatterns: [
    '/node_modules/(?!styled-components).+\\.js$',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.styles.js',
    '!src/app/layout.js', 
    '!src/lib/**', 
    '!src/app/globals.css', 
  ],
};

module.exports = createJestConfig(customJestConfig);
