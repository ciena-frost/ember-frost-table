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

    describe('_isSelectable', function () {
      describe('selection is enabled', function () {
        beforeEach(function () {
          component.setProperties({
            onSelectionChange: function () {}
          })
        })

        it('_isSelectable should be true', function () {
          expect(component.get('_isSelectable')).to.equal(true)
        })
      })

      describe('selection is not enabled', function () {
        it('_isSelectable should be false', function () {
          expect(component.get('_isSelectable')).to.equal(false)
        })
      })
    })
  })

  describe('.accountForSelectionColumn()', function () {
    describe('when selection is not enabled', function () {
      it('should not account for selection column when aligning columns', function () {
        expect(component.accountForSelectionColumn(0)).to.equal(0)
      })
    })

    describe('when selection is enabled', function () {
      beforeEach(function () {
        component.setProperties({
          onSelectionChange: function () {}
        })
      })
      it('should account for selection column when aligning columns', function () {
        expect(component.accountForSelectionColumn(0)).to.equal(1)
      })
    })
  })

  describe('.setCellWidths()', function () {
    let bodyColumn1Stub, bodyColumn2Stub, headerColumn1Stub, headerColumn2Stub, categoriesStub
    beforeEach(function () {
      bodyColumn1Stub = createSelectorStub('css')
      bodyColumn2Stub = createSelectorStub('css')
      headerColumn1Stub = createSelectorStub('css', 'outerWidth')
      headerColumn2Stub = createSelectorStub('css', 'outerWidth')
      categoriesStub = createSelectorStub()

      bodyColumn1Stub.css.withArgs('flex-basis').returns(50)
      bodyColumn2Stub.css.withArgs('flex-basis').returns(100)
      headerColumn1Stub.outerWidth.returns(100)
      headerColumn2Stub.outerWidth.returns(50)
      categoriesStub.length = 0

      sandbox.stub(component, '$')
        .withArgs('.has-categories').returns(categoriesStub)
        .withArgs('.frost-table-row .frost-table-body-cell:nth-child(1)').returns(bodyColumn1Stub)
        .withArgs('.frost-table-row .frost-table-body-cell:nth-child(2)').returns(bodyColumn2Stub)
        .withArgs('.frost-table-header  .frost-table-cell:nth-child(1)').returns(headerColumn1Stub)
        .withArgs('.frost-table-header  .frost-table-cell:nth-child(2)').returns(headerColumn2Stub)
    })

    describe('when header column is wider than body column', function () {
      let totalWidth
      beforeEach(function () {
        totalWidth = component.setCellWidths(1)
      })

      it('should have returned total width', function () {
        expect(totalWidth).to.equal(100)
      })

      it('should have set header column width', function () {
        expect(headerColumn1Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
      })

      it('should have set body column width', function () {
        expect(bodyColumn1Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
      })
    })

    describe('when body column is wider than header column', function () {
      let totalWidth
      beforeEach(function () {
        totalWidth = component.setCellWidths(2)
      })

      it('should have returned total width', function () {
        expect(totalWidth).to.equal(100)
      })

      it('should have set header column width', function () {
        expect(headerColumn2Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
      })

      it('should have set body column width', function () {
        expect(bodyColumn2Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
      })
    })
  })

  describe('.didInsertElement()', function () {
    let column1, column2, column3, tableStub, selectionCell, headerSelectionCell
    beforeEach(function () {
      column1 = {}
      column2 = {}
      column3 = {}
      component.setProperties({
        columns: [column1, column2, column3]
      })
      tableStub = createSelectorStub('css')
      selectionCell = createSelectorStub('css')
      headerSelectionCell = createSelectorStub('css')
      sandbox.stub(component, '$')
        .withArgs('.frost-table-row-selection').returns(selectionCell)
        .withArgs('.frost-table-header-selection-cell').returns(headerSelectionCell)
        .withArgs().returns(tableStub)
    })

    describe('with selection enabled', function () {
      beforeEach(function () {
        component.setProperties({
          onSelectionChange: () => {}
        })
        sandbox.stub(component, 'setCellWidths')
          .withArgs(1).returns(100)
          .withArgs(2).returns(50)
          .withArgs(3).returns(25)
          .withArgs(4).returns(25)

        component.didInsertElement()
      })

      it('should have aligned each column', function () {
        expect(component.setCellWidths).to.have.callCount(4)
      })

      it('should have set table minimum width', function () {
        expect(tableStub.css).to.have.been.calledWithExactly('min-width', '200px')
      })

      it('should ensure selection column stays same size', function () {
        expect(selectionCell.css).to.have.been.calledWithExactly({
          'flex-grow': 0,
          'flex-shrink': 0
        })
      })

      it('should ensure selection header column stays same size', function () {
        expect(headerSelectionCell.css).to.have.been.calledWithExactly({
          'flex-grow': 0,
          'flex-shrink': 0
        })
      })
    })

    describe('with selection not enabled', function () {
      beforeEach(function () {
        sandbox.stub(component, 'setCellWidths')
          .withArgs(1).returns(100)
          .withArgs(2).returns(50)
          .withArgs(3).returns(25)
        component.didInsertElement()
      })

      it('should have aligned each column', function () {
        expect(component.setCellWidths).to.have.callCount(3)
      })

      it('should have set table minimum width', function () {
        expect(tableStub.css).to.have.been.calledWithExactly('min-width', '175px')
      })

      it('should not have touch selection column', function () {
        expect(selectionCell.css).to.have.callCount(0)
      })

      it('should not have touch selection header column', function () {
        expect(headerSelectionCell.css).to.have.callCount(0)
      })
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
