import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

const test = integration('frost-table-header-selection')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    this.render(hbs`
      {{frost-table-header-selection
        hook='sel'
        hookQualifiers=(hash foo='bar')
      }}
    `)

    return wait()
  })

  // I'm adding this here so something shows up in the lint output at least, I've also opened an issue
  // https://github.com/ciena-frost/ember-frost-table/issues/18 to track it (@job13er 2017-06-08)
  it.skip('should have real tests', function () {
    expect(true).to.equal(false)
  })

  it('should render something', function () {
    expect(this.$()).to.have.length(1)
  })
})
