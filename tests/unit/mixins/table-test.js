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

  describe('.alignHeaderAndBody()', function () {
    let returnVal
    beforeEach(function () {
      mixin.get = sinon.stub()
      mixin.get.withArgs('headerColumnsSelector').returns('.columns')

      mixin.alignColumns = sinon.stub()
      mixin.alignColumns.returns(100)

      returnVal = mixin.alignHeaderAndBody('.header-class', '.body-class')
    })

    it('should have called .alignColumns() with correct parameters', function () {
      expect(mixin.alignColumns).to.have.been.calledWithExactly(
        '.header-class .columns, .body-class .frost-table-row'
      )
    })

    it('should have called returned the minimum table width', function () {
      expect(returnVal).to.eql(100)
    })
  })

  describe('.alignColumns()', function () {
    let returnVal, allRowsStub, firstRowStub, firstRowCellStub, column1Stub, column2Stub
    beforeEach(function () {
      allRowsStub = createSelectorStub('eq', 'children')
      firstRowStub = createSelectorStub('children')
      firstRowCellStub = createSelectorStub()
      column1Stub = createSelectorStub()
      column2Stub = createSelectorStub()

      mixin.$ = sinon.stub()
      mixin.$.withArgs('.foo-class').returns(allRowsStub)

      mixin.alignColumn = sinon.stub()
      mixin.alignColumn.withArgs(column1Stub)
        .returns(100)
      mixin.alignColumn.withArgs(column2Stub)
        .returns(200)

      allRowsStub.eq.withArgs(0).returns(firstRowStub)
      allRowsStub.children.withArgs(':nth-child(1)').returns(column1Stub)
      allRowsStub.children.withArgs(':nth-child(2)').returns(column2Stub)
      firstRowStub.children.returns(firstRowCellStub)
      firstRowCellStub.length = 2

      returnVal = mixin.alignColumns('.foo-class')
    })

    it('should have called .alignColumn() for first column', function () {
      expect(mixin.alignColumn).to.have.been.calledWith(column1Stub)
    })

    it('should have called .alignColumn() for second column', function () {
      expect(mixin.alignColumn).to.have.been.calledWith(column2Stub)
    })

    it('should have returned the total width of all columns', function () {
      expect(returnVal).to.eql(300)
    })
  })

  describe('.alignColumn()', function () {
    let cellsStub, cell1Stub, cell2Stub, cell3Stub
    beforeEach(function () {
      cellsStub = createSelectorStub('css', 'toArray')
      cell1Stub = createSelectorStub('css')
      cell2Stub = createSelectorStub('css')
      cell3Stub = createSelectorStub('css')

      cellsStub.toArray.returns([cell1Stub, cell2Stub, cell3Stub])
      cell1Stub.css.withArgs('flex-basis').returns(100)
      cell2Stub.css.withArgs('flex-basis').returns(20)
      cell3Stub.css.withArgs('flex-basis').returns(20)

      mixin.$ = sinon.stub()
      mixin.$.withArgs(cell1Stub).returns(cell1Stub)
      mixin.$.withArgs(cell2Stub).returns(cell2Stub)
      mixin.$.withArgs(cell3Stub).returns(cell3Stub)

      mixin.alignColumn(cellsStub)
    })

    it('should set correct flex-basis for the column cells', function () {
      expect(cellsStub.css).to.have.been.calledWithExactly('flex-basis', '100px')
    })
  })

  describe('.setMinimumCellWidths()', function () {
    let cell1Stub, cell2Stub, rowsStub,
      firstRowStub, firstRowColumnsStub
    beforeEach(function () {
      cell1Stub = createSelectorStub('css', 'outerWidth')
      cell2Stub = createSelectorStub('css', 'outerWidth')
      rowsStub = createSelectorStub('eq')
      firstRowStub = createSelectorStub('children')
      firstRowColumnsStub = createSelectorStub('length')

      cell1Stub.outerWidth.returns(10)
      cell2Stub.outerWidth.returns(20)
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
          .returns(cell1Stub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(2)')
          .returns(cell2Stub)
        mixin.setMinimumCellWidths('.foo')
      })

      it('should set correct minimum width for first column', function () {
        expect(cell1Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '10px'
        })
      })

      it('should set correct minimum width for second column', function () {
        expect(cell2Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '20px'
        })
      })
    })

    describe('when selection column', function () {
      let selectionCellStub
      beforeEach(function () {
        selectionCellStub = createSelectorStub('css', 'outerWidth')
        selectionCellStub.outerWidth.returns(30)
        firstRowColumnsStub.length = 3

        mixin.$ = sinon.stub()
        mixin.$.withArgs('.foo')
          .returns(rowsStub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(1)')
          .returns(selectionCellStub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(2)')
          .returns(cell1Stub)
        mixin.$.withArgs('.foo .frost-table-cell:nth-child(3)')
          .returns(cell2Stub)

        mixin.setProperties({onSelectionChange: () => {}})
        mixin.setMinimumCellWidths('.foo')
      })

      it('should set correct minimum width for selection column', function () {
        expect(selectionCellStub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '30px'
        })
      })

      it('should set correct minimum width for first column', function () {
        expect(cell1Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '10px'
        })
      })

      it('should set correct minimum width for second column', function () {
        expect(cell2Stub.css).to.have.been.calledWithExactly({
          'flex-grow': 1,
          'flex-shrink': 0,
          'flex-basis': '20px'
        })
      })
    })
  })
})
