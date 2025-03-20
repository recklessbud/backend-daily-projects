export default{
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js', "json"],
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    watchPathIgnorePatterns: ['node_modules'],
    collectCoverage: true, // Enable code coverage
    coverageDirectory: 'coverage', // Directory to store coverage reports
    coverageReporters: ['text', 'lcov'], // Types of coverage reports
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Support path aliases
    },
    //setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'], // Setup file for initialization (e.g., mock data, DB connection)
}