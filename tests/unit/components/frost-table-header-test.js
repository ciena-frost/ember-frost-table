/**
 * Unit test for the frost-table-header component
 */

import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {createSelectorStub} from 'dummy/tests/helpers/selector-stub'

const test = unit('frost-table-header')
describe(test.label, function () {
  test.setup()

  let component, columns, columnsWithCategories, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      columns: [],
      columnsWithCategories: [],
      hook: 'table',
      hookQualifiers: {foo: 'bar'},
      items: [],
      tagName: 'div',
      onCallback: function () {}
    })

    columns = [
      {
        propertyName: 'name'
      },
      {
        propertyName: 'description'
      },
      {
        propertyName: 'info1'
      },
      {
        propertyName: 'info2'
      },
      {
        propertyName: 'info3'
      },
      {
        propertyName: 'summary1'
      },
      {
        propertyName: 'summary2'
      }
    ]

    columnsWithCategories = [
      {
        propertyName: 'name'
      },
      {
        propertyName: 'description',
        category: 'Infomation',
        categoryClassName: 'info-category'
      },
      {
        propertyName: 'info1',
        category: 'Infomation',
        categoryClassName: 'info-category'
      },
      {
        propertyName: 'info2',
        category: 'Infomation',
        categoryClassName: 'info-category'
      },
      {
        propertyName: 'info3',
        category: 'Infomation',
        categoryClassName: 'info-category'
      },
      {
        propertyName: 'summary1',
        category: 'Summary',
        categoryClassName: 'sum-category'
      },
      {
        propertyName: 'summary2',
        category: 'Summary',
        categoryClassName: 'sum-category'
      },
      {
        propertyName: 'categoryless'
      },
      {
        propertyName: 'info4',
        category: 'Infomation',
        categoryClassName: 'info-category'
      }
    ]
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('Computed Properties', function () {
    describe('_categoryColumns', function () {
      describe('with categories set', function () {
        beforeEach(function () {
          component.setProperties({columns: columnsWithCategories})
        })

        let assertCorrectValuesSet = (index, label, span, className, renderer) => {
          const column = component.get('_categoryColumns')[index]
          expect(column).to.eql({
            index,
            label,
            span,
            className,
            renderer
          })
        }

        it('should have created the correct number of category columns', function () {
          expect(component.get('_categoryColumns').length).to.equal(5)
        })

        it('should have set the correct values in the category column objects', function () {
          assertCorrectValuesSet(0, '', 1, undefined, undefined)
          assertCorrectValuesSet(1, 'Infomation', 4, 'info-category', undefined)
          assertCorrectValuesSet(2, 'Summary', 2, 'sum-category', undefined)
          assertCorrectValuesSet(3, '', 1, undefined, undefined)
          assertCorrectValuesSet(4, 'Infomation', 1, 'info-category', undefined)
        })
      })

      describe('without categories set', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have created a single category column with a blank label', function () {
          expect(component.get('_categoryColumns').length).to.equal(1)
          expect(component.get('_categoryColumns')[0].label).to.equal('')
        })
      })
    })
  })

  describe('.didInsertElement()', function () {
    let headerSelectionStub
    beforeEach(function () {
      sandbox.stub(component, 'setupRows')
      sandbox.stub(component, 'alignCategories')
      sandbox.stub(component, 'setMinimumCellWidths')
      headerSelectionStub = createSelectorStub('css')
      sandbox.stub(component, '$')
        .withArgs('.frost-table-header-selection-cell').returns(headerSelectionStub)
    })

    describe('selection enabled', function () {
      beforeEach(function () {
        component.set('isSelectable', true)
        component.didInsertElement()
      })

      it('should ensured selection cell doesn\'t grow', function () {
        expect(headerSelectionStub.css).to.have.been.calledWithExactly({
          'flex-grow': 0,
          'flex-shrink': 0
        })
      })
    })

    describe('selection disabled', function () {
      beforeEach(function () {
        component.set('isSelectable', false)
        component.didInsertElement()
      })

      it('should not have set flex parameters for selection cell', function () {
        expect(headerSelectionStub.css).to.have.been.callCount(0)
      })
    })

    describe('with categories', function () {
      beforeEach(function () {
        sandbox.stub(component, 'get').withArgs('haveCategories').returns(true)

        component.didInsertElement()

        return wait()
      })

      it('should have wrapped header cells in row tags', function () {
        expect(component.setupRows).to.have.callCount(1)
      })

      it('should have aligned the category cells', function () {
        expect(component.alignCategories).to.have.callCount(1)
      })

      it('should not have aligned the column cells', function () {
        expect(component.setMinimumCellWidths).to.have.callCount(1)
      })
    })

    describe('without categories', function () {
      beforeEach(function () {
        component.didInsertElement()
      })

      it('should not have wrapped header cells in row tags', function () {
        expect(component.setupRows).to.have.callCount(0)
      })

      it('should not have aligned the category cells', function () {
        expect(component.alignCategories).to.have.callCount(0)
      })

      it('should not have aligned the column cells', function () {
        expect(component.setMinimumCellWidths).to.have.callCount(1)
      })
    })
  })

  describe('.setupRows()', function () {
    let cellSelectorStub, categoryCellStub, columnCellStub
    beforeEach(function () {
      component.setProperties({columns: columnsWithCategories})

      cellSelectorStub = createSelectorStub('slice')
      categoryCellStub = createSelectorStub('wrapAll')
      columnCellStub = createSelectorStub('wrapAll')

      sandbox.stub(component, '$')
        .withArgs('.frost-table-header-cell').returns(cellSelectorStub)

      cellSelectorStub.slice
        .withArgs(0, 5).returns(categoryCellStub)
        .withArgs(5).returns(columnCellStub)
    })

    describe('with custom row tag', function () {
      beforeEach(function () {
        component.setProperties({rowTagName: 'div'})
        component.setupRows()
      })

      it('should have wrapped category cells in a row', function () {
        expect(categoryCellStub.wrapAll).to.have.callCount(1)
        expect(categoryCellStub.wrapAll).to.have.been
          .calledWithExactly("<div class='frost-table-header-categories frost-table-row frost-table-header-row'></div>")
      })

      it('should have wrapped column cells in a row', function () {
        expect(columnCellStub.wrapAll).to.have.callCount(1)
        expect(columnCellStub.wrapAll).to.have.been
          .calledWithExactly("<div class='frost-table-header-columns frost-table-row frost-table-header-row'></div>")
      })
    })

    describe('with custom row tag', function () {
      beforeEach(function () {
        component.setupRows()
      })

      it('should have wrapped category cells in a row', function () {
        expect(categoryCellStub.wrapAll).to.have.callCount(1)
        expect(categoryCellStub.wrapAll).to.have.been
          .calledWithExactly("<tr class='frost-table-header-categories frost-table-row frost-table-header-row'></tr>")
      })

      it('should have wrapped column cells in a row', function () {
        expect(columnCellStub.wrapAll).to.have.callCount(1)
        expect(columnCellStub.wrapAll).to.have.been
          .calledWithExactly("<tr class='frost-table-header-columns frost-table-row frost-table-header-row'></tr>")
      })
    })
  })

  describe('.alignCategories()', function () {
    let categoriesStub, columnsStub, columnStubs, categoryStubs
    beforeEach(function () {
      component.setProperties({columns: columnsWithCategories})

      columnsStub = createSelectorStub('slice')
      categoriesStub = createSelectorStub('eq')

      sandbox.stub(component, '$')
        .withArgs('.frost-table-header-columns .frost-table-cell').returns(columnsStub)
        .withArgs('.frost-table-header-categories .frost-table-cell').returns(categoriesStub)

      columnStubs = columnsWithCategories.map((item, index) => {
        const stub = createSelectorStub('css')
        stub.css.withArgs('flex-basis').returns(`${5 * (index + 1)}px`)
        stub.css.withArgs('flex-grow').returns(1)
        stub.css.withArgs('flex-shrink').returns(0)
        component.$.withArgs(stub).returns(stub)
        return stub
      })

      categoryStubs = component.get('_categoryColumns').map((item, index) => {
        return createSelectorStub('css')
      })

      let startColumn = 0
      component.get('_categoryColumns').forEach((item, index) => {
        const endColumn = startColumn + item.span
        const sliceStub = createSelectorStub('toArray')
        columnsStub.slice.withArgs(startColumn, endColumn).returns(sliceStub)
        sliceStub.toArray.returns(columnStubs.slice(startColumn, endColumn))
        categoriesStub.eq.withArgs(index).returns(categoryStubs[index])
        startColumn = endColumn
      })

      component.alignCategories()
    })

    it('should have set correct minimum width for first category', function () {
      expect(categoryStubs[0].css).to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': '5px'
      })
    })

    it('should have set correct minimum width for second category', function () {
      expect(categoryStubs[1].css).to.have.been.calledWithExactly({
        'flex-grow': 4,
        'flex-shrink': 0,
        'flex-basis': '70px'
      })
    })

    it('should have set correct minimum width for third category', function () {
      expect(categoryStubs[2].css).to.have.been.calledWithExactly({
        'flex-grow': 2,
        'flex-shrink': 0,
        'flex-basis': '65px'
      })
    })

    it('should have set correct minimum width for fourth category', function () {
      expect(categoryStubs[3].css).to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': '40px'
      })
    })

    it('should have set correct minimum width for fifth category', function () {
      expect(categoryStubs[4].css).to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': '45px'
      })
    })
  })
})
