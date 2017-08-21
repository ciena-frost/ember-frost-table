/**
 * Unit test for the frost-table component
 *
 * NOTE: Since it is not easy to properly set up an integration test to confirm some of the DOM
 * calculations happening in frost-table, I opted to unit test these calculations, making these
 * tests a little more tied to the implementation than I'd like. However, given the hoops needed to jump through to
 * simulate external CSS as well as scroll and mouse events, this seemed the better option (@job13er 2016-12-13)
 */

import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {createSelectorStub} from 'dummy/tests/helpers/selector-stub'

const test = unit('frost-table')
describe(test.label, function () {
  test.setup()

  let component, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      columns: [],
      hook: 'table',
      hookQualifiers: {foo: 'bar'},
      items: [],
      tagName: 'div'
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('Computed Properties', function () {
    describe('indexedColumns', function () {
      let column1, column2, column3
      beforeEach(function () {
        column1 = {}
        column2 = {}
        column3 = {}
        component.setProperties({
          columns: [column1, column2, column3]
        })
      })

      it('should have set proper index for each column', function () {
        const indexedColumns = component.get('indexedColumns')
        expect(indexedColumns[0].index).to.equal(0)
        expect(indexedColumns[1].index).to.equal(1)
        expect(indexedColumns[2].index).to.equal(2)
      })
    })

    describe('isSelectable', function () {
      describe('selection is enabled', function () {
        beforeEach(function () {
          component.setProperties({
            onSelectionChange: function () {}
          })
        })

        it('isSelectable should be true', function () {
          expect(component.get('isSelectable')).to.equal(true)
        })
      })

      describe('selection is not enabled', function () {
        it('isSelectable should be false', function () {
          expect(component.get('isSelectable')).to.equal(false)
        })
      })
    })
  })

  describe('.didInsertElement()', function () {
    let tableStub
    beforeEach(function () {
      tableStub = createSelectorStub('css')
      sandbox.stub(component, '$')
        .withArgs().returns(tableStub)
      sandbox.stub(component, 'alignColumns')
      component.alignColumns.returns(100)
      component.didInsertElement()
    })

    it('should have called alignColumns() with correct paramaters', function () {
      expect(component.alignColumns).to.have.been.calledWithExactly('.frost-table-header', '.frost-table-body')
    })

    it('should have set the table min-width', function () {
      expect(tableStub.css).to.have.been.calledWithExactly('min-width', '100px')
    })
  })

  describe('onCallback', function () {
    let onCallback
    beforeEach(function () {
      onCallback = component.get('onCallback')
    })

    it('should default to a function', function () {
      expect(onCallback()).to.equal(undefined)
    })
  })
})
