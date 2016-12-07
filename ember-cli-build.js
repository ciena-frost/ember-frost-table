/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon')

module.exports = function (defaults) {
  var app = new EmberAddon(defaults, {
    babel: {
      optional: ['es7.decorators']
    },
    'ember-cli-mocha': {
      useLintTree: false
    },
    snippetSearchPaths: [
      'addon',
      'tests/dummy'
    ]
  })

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  if (app.env === 'test') {
    ;[
      'bower_components/chai-jquery/chai-jquery.js',
      'bower_components/sinon-chai/lib/sinon-chai.js'
    ].forEach((path) => {
      app.import(path, {type: 'test'})
    })
  }

  return app.toTree()
}
