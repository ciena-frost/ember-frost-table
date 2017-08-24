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

  describe('.didInsertElement()', function () {
    let rowSelectorStub
    beforeEach(function () {
      rowSelectorStub = createSelectorStub('css')
      sandbox.stub(component, '$')
        .withArgs('.frost-table-row-selection').returns(rowSelectorStub)
      sandbox.stub(component, 'setMinimumCellWidths')
    })

    describe('row is selectable', function () {
      beforeEach(function () {
        component.set('isSelectable', true)
        component.didInsertElement()
      })

      it('should have set minimum cell widths', function () {
        expect(component.setMinimumCellWidths).to.have.been.callCount(1)
      })

      it('should ensured selection cell doesn\'t grow', function () {
        expect(rowSelectorStub.css).to.have.been.calledWithExactly({
          'flex-grow': 0,
          'flex-shrink': 0
        })
      })
    })

    describe('row is not selectable', function () {
      beforeEach(function () {
        component.set('isSelectable', false)
        component.didInsertElement()
      })

      it('should have set minimum cell widths', function () {
        expect(component.setMinimumCellWidths).to.have.been.callCount(1)
      })

      it('should not have set flex parameters for selection cell', function () {
        expect(rowSelectorStub.css).to.have.callCount(0)
      })
    })
  })
})
