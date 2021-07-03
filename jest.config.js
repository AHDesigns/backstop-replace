module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  collectCoverage: false,
  clearMocks: true,
  // moduleNameMapper: {
  //   '^@shared(.*)$': '<rootDir>/shared/$1',
  //   '^@client(.*)$': '<rootDir>/client/$1',
  //   '^@electron(.*)$': '<rootDir>/electron/$1',
  //   '^@test/(.*)$': '<rootDir>/testHelpers/$1',
  //   'package.json': '<rootDir>/package.json',
  // },
};
