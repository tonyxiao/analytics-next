module.exports = {
  collectCoverage: false,
  coverageDirectory: './coverage/',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupTestFrameworkScriptFile: './scripts/setup-test-framework.ts',
  testRegex: '(\\.(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePathIgnorePatterns: ['__mocks__/.+.jsx?$', '__mocks__/.+.tsx?$'],
}
