/**
 * Unit test for the table mixin
 */

import {expect} from 'chai'
import Ember from 'ember'
import TableMixin from 'ember-frost-table/mixins/table'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {createSelectorStub} from 'dummy/tests/helpers/selector-stub'

describe('Unit / Mixins / table', function () {
  let mixin, columns, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    let Mixin = Ember.Object.extend(TableMixin, {
      columns: [],
      items: []
    })
    mixin = Mixin.create()

    columns = [
      {
        propertyName: 'name'
      },
      {
        propertyName: 'description',
        category: 'Infomation'
      },
      {
        propertyName: 'info1',
        category: 'Infomation'
      },
      {
        propertyName: 'info2',
        category: 'Infomation'
      },
      {
        propertyName: 'info3',
        category: 'Infomation'
      },
      {
        propertyName: 'summary1',
        category: 'Summary'
      },
      {
        propertyName: 'summary2',
        category: 'Summary'
      }
    ]
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('Computed Properties', function () {
    describe('haveCategories', function () {
      describe('have columns with categories', function () {
        beforeEach(function () {
          mixin.setProperties({columns})
        })

        it('haveCategories should be true', function () {
          expect(mixin.get('haveCategories')).to.equal(true)
        })
      })

      describe('no columns with categories', function () {
        beforeEach(function () {
          mixin.setProperties({
            columns: [
              {
                frozen: true,
                propertyName: 'name'
              },
              {
                frozen: true,
                propertyName: 'description'
              },
              {
                propertyName: 'info1'
              },
              {
                propertyName: 'info2'
              }
            ]
          })
        })

        it('haveCategories should be false', function () {
          expect(mixin.get('haveCategories')).to.equal(false)
        })
      })
    })
  })

  describe('.didRender()', function () {
    let rowSelectionStub, headerSelectionStub
    beforeEach(function () {
      rowSelectionStub = createSelectorStub('css')
      headerSelectionStub = createSelectorStub('css')
      mixin.$ = sinon.stub()
      mixin.$.withArgs('.frost-table-header-selection-cell').returns(headerSelectionStub)
      mixin.$.withArgs('.frost-table-row-selection').returns(rowSelectionStub)
    })

    describe('selection enabled', function () {
      beforeEach(function () {
        mixin.set('isSelectable', true)
        mixin.didRender()
      })

      it('should ensure row selection cells do not grow', function () {
        expect(rowSelectionStub.css).to.have.been.calledWithExactly({
          'flex-grow': 0,
          'flex-shrink': 0
        })
      })

      it('should ensure header selection cell does not grow', function () {
        expect(headerSelectionStub.css).to.have.been.calledWithExactly({
          'flex-grow': 0,
          'flex-shrink': 0
        })
      })
    })

    describe('selection disabled', function () {
      beforeEach(function () {
        mixin.set('isSelectable', false)
        mixin.didRender()
      })

      it('should ensure row selection cells do not grow', function () {
        expect(rowSelectionStub.css).to.have.callCount(0)
      })

      it('should ensure header selection cell does not grow', function () {
        expect(headerSelectionStub.css).to.have.callCount(0)
      })
    })
  })

  describe('.alignColumns()', function () {
    let headerStub, headerColumnsStub, headerColumn1Stub, headerColumn2Stub, bodyColumn1Stub, bodyColumn2Stub
    beforeEach(function () {
      headerStub = createSelectorStub()
      headerColumnsStub = createSelectorStub('eq', 'length')
      headerColumn1Stub = createSelectorStub('css')
      headerColumn2Stub = createSelectorStub('css')
      bodyColumn1Stub = createSelectorStub('css')
      bodyColumn2Stub = createSelectorStub('css')
      mixin.$ = sinon.stub()
      mixin.$.withArgs('.header-class .frost-table-header-cell')
        .returns(headerColumnsStub)
      mixin.$.withArgs('.body-class .frost-table-row .frost-table-cell:nth-child(1)')
        .returns(bodyColumn1Stub)
      mixin.$.withArgs('.body-class .frost-table-row .frost-table-cell:nth-child(2)')
        .returns(bodyColumn2Stub)
      mixin.$.withArgs('.has-categories')
        .returns(headerStub)

      headerStub.length = 1
      headerColumnsStub.length = 2
      headerColumnsStub.eq.withArgs(0).returns(headerColumn1Stub)
      headerColumnsStub.eq.withArgs(1).returns(headerColumn2Stub)

      headerColumn1Stub.css.withArgs('flex-basis').returns(100)
      headerColumn2Stub.css.withArgs('flex-basis').returns(20)

      bodyColumn1Stub.css.withArgs('flex-basis').returns(20)
      bodyColumn2Stub.css.withArgs('flex-basis').returns(100)

      mixin.alignColumns('.header-class', '.body-class')
    })

    it('should set width and flex-basis of body columns', function () {
      expect(bodyColumn1Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
      expect(bodyColumn2Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
    })

    it('should set width and flex-basis of header columns', function () {
      expect(headerColumn1Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
      expect(headerColumn2Stub.css).to.have.been.calledWithExactly('flex-basis', '100px')
    })
  })

  describe('.setMinimumCellWidths()', function () {
    let column1Stub, column2Stub, cell1Stub, cell2Stub, cell3Stub, cell4Stub, rowsStub,
      firstRowStub, firstRowColumnsStub
    beforeEach(function () {
      column1Stub = createSelectorStub('css', 'toArray')
      column2Stub = createSelectorStub('css', 'toArray')
      cell1Stub = createSelectorStub('css', 'outerWidth')
      cell2Stub = createSelectorStub('css', 'outerWidth')
      cell3Stub = createSelectorStub('css', 'outerWidth')
      cell4Stub = createSelectorStub('css', 'outerWidth')
      rowsStub = createSelectorStub('eq')
      firstRowStub = createSelectorStub('children')
      firstRowColumnsStub = createSelectorStub('length')

      column1Stub.toArray.returns([cell1Stub, cell2Stub])
      column2Stub.toArray.returns([cell3Stub, cell4Stub])
      cell1Stub.outerWidth.returns(10)
      cell2Stub.outerWidth.returns(20)
      cell3Stub.outerWidth.returns(40)
      cell4Stub.outerWidth.returns(30)
      rowsStub.eq.withArgs(0).returns(firstRowStub)
      firstRowStub.children.withArgs('.frost-table-cell').returns(firstRowColumnsStub)
    })

    describe('when no selection column', function () {
      beforeEach(function () {
        firstRowColumnsStub.length = 2
        mixin.$ = sinon.stub()
        mixin.$.withArgs('.foo')
          .returns(rowsStub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(1)')
          .returns(column1Stub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(2)')
          .returns(column2Stub)
        mixin.$.withArgs(cell1Stub)
          .returns(cell1Stub)
        mixin.$.withArgs(cell2Stub)
          .returns(cell2Stub)
        mixin.$.withArgs(cell3Stub)
          .returns(cell3Stub)
        mixin.$.withArgs(cell4Stub)
          .returns(cell4Stub)
        mixin.setMinimumCellWidths('.foo')
      })

      it('should set correct minimum width for first column', function () {
        expect(column1Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '20px'
        })
      })

      it('should set correct minimum width for second column', function () {
        expect(column2Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '40px'
        })
      })
    })

    describe('when selection column', function () {
      let selectionColumnStub, selectionCell1Stub, selectionCell2Stub
      beforeEach(function () {
        selectionColumnStub = createSelectorStub('css', 'toArray')
        selectionCell1Stub = createSelectorStub('css', 'outerWidth')
        selectionCell2Stub = createSelectorStub('css', 'outerWidth')
        selectionColumnStub.toArray.returns([selectionCell1Stub, selectionCell2Stub])
        selectionCell1Stub.outerWidth.returns(10)
        selectionCell2Stub.outerWidth.returns(20)
        firstRowColumnsStub.length = 3

        mixin.$ = sinon.stub()
        mixin.$.withArgs('.foo')
          .returns(rowsStub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(1)')
          .returns(selectionColumnStub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(2)')
          .returns(column1Stub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(3)')
          .returns(column2Stub)
        mixin.$.withArgs(cell1Stub)
          .returns(cell1Stub)
        mixin.$.withArgs(cell2Stub)
          .returns(cell2Stub)
        mixin.$.withArgs(cell3Stub)
          .returns(cell3Stub)
        mixin.$.withArgs(cell4Stub)
          .returns(cell4Stub)
        mixin.$.withArgs(selectionCell1Stub)
          .returns(selectionCell1Stub)
        mixin.$.withArgs(selectionCell2Stub)
          .returns(selectionCell2Stub)

        mixin.setProperties({onSelectionChange: () => {}})
        mixin.setMinimumCellWidths('.foo')
      })

      it('should set correct minimum width for selection column', function () {
        expect(column1Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '20px'
        })
      })

      it('should set correct minimum width for first column', function () {
        expect(column1Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '20px'
        })
      })

      it('should set correct minimum width for second column', function () {
        expect(column2Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '40px'
        })
      })
    })
  })
})
