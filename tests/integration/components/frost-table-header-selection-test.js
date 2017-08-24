import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const test = integration('frost-table-header-selection')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    this.render(hbs`
      {{frost-table-header-selection
        hook='mySelection'
        onSelectionChange=onSelectionChange
      }}
    `)

    return wait()
  })

  it('should render', function () {
    expect(this.$()).to.have.length(1)
  })

  it('should have correct class set', function () {
    expect($hook('mySelection')).to.have.class('frost-table-header-selection')
  })

  it('should have correct default label', function () {
    expect($hook('mySelection').text().trim()).to.eql('Clear')
  })

  describe('Events', function () {
    let onSelectionChangeStub
    beforeEach(function () {
      onSelectionChangeStub = sinon.stub()
      this.set('onSelectionChange', onSelectionChangeStub)

      $hook('mySelection').click()

      return wait()
    })

    it('should pass empty array to onSelectionChange handler', function () {
      expect(onSelectionChangeStub).to.have.been.calledWithExactly([])
    })
  })
})
