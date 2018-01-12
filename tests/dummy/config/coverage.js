module.exports = {
  coverageEnvVar: 'COVERAGE',
  coverageFolder: 'coverage',
  excludes: [
    '**/app/**/*',
    '**/dummy/**/*'
  ],
  useBabelInstrumenter: true,
  reporters: [
    'html',
    'json-summary',
    'lcov',
    'text-summary'
  ]
}
