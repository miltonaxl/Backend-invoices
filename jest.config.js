const testMatch = [];

const e2eTestMatch = "<rootDir>/src/**/__tests__/e2e/**/*test.ts";
const unitTestMatch = "<rootDir>/src/**/__tests__/unit/**/*test.ts";

if (process.env.TEST_TYPE === "unit") {
  testMatch.push(unitTestMatch);
}
if (process.env.TEST_TYPE === "e2e") {
  testMatch.push(e2eTestMatch);
}

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: testMatch.length ? testMatch : [e2eTestMatch, unitTestMatch],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
};
