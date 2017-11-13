/* eslint-env node */

'use strict'

const path = require('path')

function initOptions (options) {
  options.babel = options.babel || {}
  options.babel.optional = options.babel.optional || []
}

module.exports = {
  name: 'ember-frost-table',

  init: function (app) {
    if (this._super.init) {
      this._super.init.apply(this, arguments)
    }

    this.options = this.options || {}
    initOptions(this.options)

    if (this.options.babel.optional.indexOf('es7.decorators') === -1) {
      this.options.babel.optional.push('es7.decorators')
    }
  },

  // Needed for ember-cli-sass (https://github.com/aexmachina/ember-cli-sass#addon-usage)
  included: function (app) {
    // Addons - see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app
    }

    this._super.included.apply(this, app)

    if (app) {
      app.import(path.join('vendor', 'ua-parser.min.js'))
    }
  }
}
