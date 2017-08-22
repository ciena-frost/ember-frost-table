/**
 * Unit test for the frost-table-row component
 */

import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {createSelectorStub} from 'dummy/tests/helpers/selector-stub'

const test = unit('frost-table-row')
describe(test.label, function () {
  test.setup()

  let component, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      columns: [],
      items: [],
      hook: 'myRow',
      onCallback: function () {}
    })
  })

  describe('Computed Properties', function () {
    describe('_isItemSelected', function () {
      let item = {foo: 'bar'}
      beforeEach(function () {
        component.setProperties({
          item
        })
      })

      describe('item is selected', function () {
        beforeEach(function () {
          component.setProperties({
            selectedItems: [item]
          })
        })

        it('should be true', function () {
          expect(component.get('_isItemSelected')).to.eql(true)
        })
      })

      describe('item is not selected', function () {
        beforeEach(function () {
          component.setProperties({
            selectedItems: []
          })
        })

        it('should be false', function () {
          expect(component.get('_isItemSelected')).to.eql(false)
        })
      })
    })
  })

  describe('.didRender()', function () {
    let rowStub
    beforeEach(function () {
      rowStub = createSelectorStub('css')
      sandbox.stub(component, '$')
        .withArgs().returns(rowStub)
      sandbox.stub(component, 'setMinimumCellWidths')
        .withArgs('').returns(100)
      component.didRender()
    })

    it('should have set minimum row width', function () {
      expect(rowStub.css).to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': '100px'
      })
    })
  })
})
