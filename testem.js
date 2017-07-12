/* eslint-env node */

const Reporter = require('ember-test-utils/reporter')

module.exports = {
  'framework': 'mocha',
  'test_page': 'tests/index.html?hidepassed',
  'disable_watching': true,
  'launch_in_ci': [
    'Chrome',
    'Firefox'
  ],
  'launch_in_dev': [
    'Chrome'
  ],
  reporter: new Reporter()
}
