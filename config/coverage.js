module.exports = {
  coverageEnvVar: 'COVERAGE',
  coverageFolder: 'coverage',
  useBabelInstrumenter: true,
  reporters: ['json'],
  excludes: [
    /app\/(.*)/,
    /dummy\/(.*)/
  ]
}
