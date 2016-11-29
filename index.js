'use strict'

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
  }
}
