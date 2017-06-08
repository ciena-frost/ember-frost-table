import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {describe, it} from 'mocha'

describe('Integration | Component | frost table header selection', function () {
  setupComponentTest('frost-table-header-selection', {
    integration: true
  })

  it('renders', function () {
    // Set any properties with this.set('myProperty', 'value')
    // Handle any actions with this.on('myAction', function(val) { ... })
    // Template block usage:
    // this.render(hbs`
    //   {{#frost-table-header-selection}}
    //     template content
    //   {{/frost-table-header-selection}}
    // `)

    this.render(hbs`{{frost-table-header-selection}}`)
    expect(this.$()).to.have.length(1)
  })
})
