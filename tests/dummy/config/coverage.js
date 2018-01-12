module.exports = {
  coverageEnvVar: 'COVERAGE',
  coverageFolder: 'coverage',
  useBabelInstrumenter: true,
  reporters: [
    'html',
    'json-summary',
    'lcov',
    'text-summary'
  ],
  excludes: [
    /app\/(.*)/,
    /dummy\/(.*)/
  ]
}
