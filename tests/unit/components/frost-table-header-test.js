/**
 * Unit test for the frost-table-headercomponent
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
    describe('_categoryRowClass', function () {
      it('should have set categories row CSS class', function () {
        expect(component.get('_categoryRowClass')).to.equal('frost-table-header-categories')
      })
    })

    describe('_columnRowClass', function () {
      it('should have set columns row CSS class', function () {
        expect(component.get('_columnRowClass')).to.equal('frost-table-header-columns')
      })
    })

    describe('_hasCategories', function () {
      describe('with categories set', function () {
        beforeEach(function () {
          component.setProperties({columns: columnsWithCategories})
        })

        it('should have detected categories', function () {
          expect(component.get('_hasCategories')).to.eql(true)
        })
      })

      describe('without categories set', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have detected no categories', function () {
          expect(component.get('_hasCategories')).to.eql(false)
        })
      })
    })

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
    beforeEach(function () {
      sandbox.stub(component, 'setupRows')
      sandbox.stub(component, 'alignCategories')
      sandbox.stub(component, 'alignColumns')
    })

    describe('with categories', function () {
      beforeEach(function () {
        sandbox.stub(component, 'get').withArgs('_hasCategories').returns(true)

        component.didInsertElement()

        return wait()
      })

      it('should havewrapped header cells in row tags', function () {
        expect(component.setupRows).to.have.callCount(1)
      })

      it('should have aligned the category cells', function () {
        expect(component.alignCategories).to.have.callCount(1)
      })

      it('should not have aligned the column cells', function () {
        expect(component.alignColumns).to.have.callCount(1)
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
        expect(component.alignColumns).to.have.callCount(1)
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

  describe('._alignCategories()', function () {
    // TODO: add tests, need to figure out how to stub Ember.$ properly for this one

  })
})
