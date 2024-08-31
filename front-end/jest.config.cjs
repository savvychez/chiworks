module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js']
};
