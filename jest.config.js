module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
  ],
  coverageDirectory: "./.coverage",
  moduleFileExtensions: ["ts", "js"],
  preset: 'ts-jest',
  testEnvironment: "node",
  testRegex: "(__tests__\/.*\.test\.ts)$",
  transform: {
    ".ts": "ts-jest"
  },
  verbose: true
};
