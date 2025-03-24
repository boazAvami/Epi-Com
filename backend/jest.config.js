module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/src/tests/**/*.ts'],  // Point to the tests directory
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  };
  