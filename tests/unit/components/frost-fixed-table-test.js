/**
 * Unit test for the frost-fixed-table component
 *
 * NOTE: Since it is not easy to properly set up an integration test to confirm some of the DOM
 * calculations happening in frost-fixed-table, I opted to unit test these calculations, making these
 * tests a little more tied to the implementation than I'd like. However, given the hoops needed to jump through to
 * simulate external CSS as well as scroll and mouse events, this seemed the better option (@job13er 2016-12-13)
 */

import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {createSelectorStub} from 'dummy/tests/helpers/selector-stub'

function _rewriteIndices (cols) {
  return cols.map((column, index) => Object.assign({
    index,
    category: column.category || ''
  }, column))
}

const test = unit('frost-fixed-table')
describe(test.label, function () {
  test.setup()

  let component, columns, indexedColumns, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      columns: [],
      hook: 'table',
      hookQualifiers: {foo: 'bar'},
      items: [],
      tagName: 'div'
    })

    columns = [
      {
        frozen: true,
        propertyName: 'name'
      },
      {
        frozen: true,
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
        frozen: true,
        propertyName: 'summary1',
        category: 'Summary'
      },
      {
        frozen: true,
        propertyName: 'summary2',
        category: 'Summary'
      }
    ]

    // The table component should add these for hooks.
    indexedColumns = _rewriteIndices(columns)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('Computed Properties', function () {
    const cpExpectedValues = {
      _bodyLeftSelector: '.frost-fixed-table-left .frost-scroll',
      _bodyMiddleSelector: '.frost-fixed-table-middle .frost-scroll',
      _bodyRightSelector: '.frost-fixed-table-right .frost-scroll',
      _headerMiddleSelector: '.frost-fixed-table-header-middle .frost-scroll',
      _headerLeftSelector: '.frost-fixed-table-header-left',
      _headerRightSelector: '.frost-fixed-table-header-right'
    }

    for (let key in cpExpectedValues) {
      describe(key, function () {
        let value
        beforeEach(function () {
          value = component.get(key)
        })

        it('should return the expected value', function () {
          expect(value).to.equal(cpExpectedValues[key])
        })
      })
    }

    describe('leftColumns', function () {
      describe('with properly ordered columns', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have the first frozen columns', function () {
          expect(component.get('leftColumns')).to.eql(indexedColumns.slice(0, 2))
        })
      })

      describe('with no leading frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(2))
        })

        it('should be empty', function () {
          expect(component.get('leftColumns')).to.eql([])
        })
      })

      describe('with no columns', function () {
        beforeEach(function () {
          component.set('columns', [])
        })

        it('should be empty', function () {
          expect(component.get('leftColumns')).to.eql([])
        })
      })
    })

    describe('middleColumns', function () {
      describe('with properly ordered columns', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have the middle non-frozen columns', function () {
          expect(component.get('middleColumns')).to.eql(indexedColumns.slice(2, 5))
        })
      })

      describe('with no leading frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(2))
        })

        it('should have the first non-frozen columns', function () {
          expect(component.get('middleColumns')).to.eql(_rewriteIndices(columns.slice(2, 5)))
        })
      })

      describe('with no trailing frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(0, 5))
        })

        it('should have the last non-frozen columns', function () {
          expect(component.get('middleColumns')).to.eql(indexedColumns.slice(2, 5))
        })
      })

      describe('with no unfrozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(0, 2))
        })

        it('should be empty', function () {
          expect(component.get('middleColumns')).to.eql([])
        })
      })
    })

    describe('rightColumns', function () {
      describe('with properly ordered columns', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('should have the last frozen columns', function () {
          expect(component.get('rightColumns')).to.eql(indexedColumns.slice(-2))
        })
      })

      describe('with no trailing frozen columns', function () {
        beforeEach(function () {
          component.set('columns', columns.slice(0, 5))
        })

        it('should be empty', function () {
          expect(component.get('rightColumns')).to.eql([])
        })
      })

      describe('with no columns', function () {
        beforeEach(function () {
          component.set('columns', [])
        })

        it('should be empty', function () {
          expect(component.get('rightColumns')).to.eql([])
        })
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

    describe('haveCategories', function () {
      describe('have columns with categories', function () {
        beforeEach(function () {
          component.setProperties({columns})
        })

        it('haveCategories should be true', function () {
          expect(component.get('haveCategories')).to.equal(true)
        })
      })

      describe('no columns with categories', function () {
        beforeEach(function () {
          component.setProperties({
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
          expect(component.get('haveCategories')).to.equal(false)
        })
      })
    })
  })

  describe('.didRender()', function () {
    beforeEach(function () {
      sandbox.stub(component, 'setupBodyHeights')
      sandbox.stub(component, 'setupHoverProxy')
      sandbox.stub(component, 'setupScrollSync')

      component.didRender()
    })

    it('should set up the body heights', function () {
      expect(component.setupBodyHeights).to.have.callCount(1)
    })

    it('should set up the hover proxy', function () {
      expect(component.setupHoverProxy).to.have.callCount(1)
    })

    it('should set up the scroll syncing', function () {
      expect(component.setupScrollSync).to.have.callCount(1)
    })
  })

  describe('.didInsertElement()', function () {
    beforeEach(function () {
      sandbox.stub(component, 'setupLeftWidths')
      sandbox.stub(component, 'setupMiddleWidths')
      sandbox.stub(component, 'setupRightWidths')
      component.didInsertElement()
    })

    it('should set up left widths', function () {
      expect(component.setupLeftWidths).to.have.callCount(1)
    })

    it('should set up middle widths', function () {
      expect(component.setupMiddleWidths).to.have.callCount(1)
    })

    it('should set up left widths', function () {
      expect(component.setupRightWidths).to.have.callCount(1)
    })
  })

  describe('.setupBodyHeights()', function () {
    let leftBodyStub, middleHeaderStub, middleBodyStub, rightBodyStub, tableStub, nonEmptyCellStub, emptyRowStub
    beforeEach(function () {
      leftBodyStub = createSelectorStub('css')
      middleBodyStub = createSelectorStub('css')
      middleHeaderStub = createSelectorStub('outerHeight')
      rightBodyStub = createSelectorStub('css')
      nonEmptyCellStub = createSelectorStub('outerHeight')
      emptyRowStub = createSelectorStub('css')
      tableStub = createSelectorStub('outerHeight')

      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-left .frost-scroll').returns(leftBodyStub)
        .withArgs('.frost-fixed-table-middle .frost-scroll').returns(middleBodyStub)
        .withArgs('.frost-fixed-table-header-middle .frost-scroll').returns(middleHeaderStub)
        .withArgs('.frost-fixed-table-right .frost-scroll').returns(rightBodyStub)
        .withArgs('.frost-table-row:not(:empty) .frost-table-row-cell').returns(nonEmptyCellStub)
        .withArgs('.frost-table-row:empty').returns(emptyRowStub)
        .withArgs().returns(tableStub)

      tableStub.outerHeight.returns(100)
      middleHeaderStub.outerHeight.returns(20)
      nonEmptyCellStub.outerHeight.returns(50)

      component.setupBodyHeights()
    })

    it('should set the height of the left body', function () {
      expect(leftBodyStub.css).to.have.been.calledWith({height: '80px'})
    })

    it('should set the height of the middle body', function () {
      expect(middleBodyStub.css).to.have.been.calledWith({height: '80px'})
    })

    it('should set the height of the right body', function () {
      expect(rightBodyStub.css).to.have.been.calledWith({height: '80px'})
    })

    it('should set the height of empty rows', function () {
      expect(emptyRowStub.css).to.have.been.calledWith({height: '50px'})
    })
  })

  describe('.setupHoverProxy()', function () {
    let leftBodyStub, middleHeaderStub, middleBodyStub, rightBodyStub
    let leftBodyMouseEnterHandler, leftBodyMouseLeaveHandler
    let middleBodyMouseEnterHandler, middleBodyMouseLeaveHandler
    let middleHeaderMouseEnterHandler, middleHeaderMouseLeaveHandler

    beforeEach(function () {
      leftBodyStub = createSelectorStub('on')
      middleBodyStub = createSelectorStub('on', 'addClass', 'removeClass')
      middleHeaderStub = createSelectorStub('on')
      rightBodyStub = createSelectorStub('addClass', 'removeClass')

      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-left .frost-scroll').returns(leftBodyStub)
        .withArgs('.frost-fixed-table-middle .frost-scroll').returns(middleBodyStub)
        .withArgs('.frost-fixed-table-header-middle .frost-scroll').returns(middleHeaderStub)
        .withArgs('.frost-fixed-table-right .frost-scroll').returns(rightBodyStub)

      component.setupHoverProxy()

      // capture the event handlers
      leftBodyMouseEnterHandler = leftBodyStub.on.getCall(0).args[1]
      leftBodyMouseLeaveHandler = leftBodyStub.on.getCall(1).args[1]
      middleBodyMouseEnterHandler = middleBodyStub.on.getCall(0).args[1]
      middleBodyMouseLeaveHandler = middleBodyStub.on.getCall(1).args[1]
      middleHeaderMouseEnterHandler = middleHeaderStub.on.getCall(0).args[1]
      middleHeaderMouseLeaveHandler = middleHeaderStub.on.getCall(1).args[1]
    })

    it('should add mouseenter handler to left body', function () {
      expect(leftBodyStub.on).to.have.been.calledWith('mouseenter', sinon.match.func)
    })

    it('should add mouseleave handler to left body', function () {
      expect(leftBodyStub.on).to.have.been.calledWith('mouseleave', sinon.match.func)
    })

    it('should add mouseenter handler to middle body', function () {
      expect(middleBodyStub.on).to.have.been.calledWith('mouseenter', sinon.match.func)
    })

    it('should add mouseleave handler to middle body', function () {
      expect(middleBodyStub.on).to.have.been.calledWith('mouseleave', sinon.match.func)
    })

    it('should add mouseenter handler to middle header', function () {
      expect(middleHeaderStub.on).to.have.been.calledWith('mouseenter', sinon.match.func)
    })

    it('should add mouseleave handler to middle header', function () {
      expect(middleHeaderStub.on).to.have.been.calledWith('mouseleave', sinon.match.func)
    })

    describe('when left body is hovered', function () {
      beforeEach(function () {
        leftBodyMouseEnterHandler()
      })

      it('should add the hover class to the right body', function () {
        expect(rightBodyStub.addClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when left body is un-hovered', function () {
      beforeEach(function () {
        leftBodyMouseLeaveHandler()
      })

      it('should remove the hover class from the right body', function () {
        expect(rightBodyStub.removeClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle body is hovered', function () {
      beforeEach(function () {
        middleBodyMouseEnterHandler()
      })

      it('should add the hover class to the right body', function () {
        expect(rightBodyStub.addClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle body is un-hovered', function () {
      beforeEach(function () {
        middleBodyMouseLeaveHandler()
      })

      it('should remove the hover class from the right body', function () {
        expect(rightBodyStub.removeClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle header is hovered', function () {
      beforeEach(function () {
        middleHeaderMouseEnterHandler()
      })

      it('should add the hover class to the middle body', function () {
        expect(middleBodyStub.addClass).to.have.been.calledWith('ps-container-hover')
      })
    })

    describe('when middle header is un-hovered', function () {
      beforeEach(function () {
        middleHeaderMouseLeaveHandler()
      })

      it('should remove the hover class from the middle body', function () {
        expect(middleBodyStub.removeClass).to.have.been.calledWith('ps-container-hover')
      })
    })
  })

  describe('.setupLeftWidths()', function () {
    const RETURNED_WIDTH = 100
    let leftBodyStub, leftBodyScrollStub, leftHeaderStub
    beforeEach(function () {
      leftBodyStub = createSelectorStub('css')
      leftBodyScrollStub = createSelectorStub('parent')
      leftHeaderStub = createSelectorStub('css')
      leftBodyScrollStub.parent.returns(leftBodyStub)

      sandbox.stub(component, 'alignColumns')
        .returns(RETURNED_WIDTH)
      sandbox.stub(component, 'setMinimumCellWidths')
      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-left .frost-scroll').returns(leftBodyScrollStub)
        .withArgs('.frost-fixed-table-header-left').returns(leftHeaderStub)

      component.setProperties({columns})
      component.setupLeftWidths()
    })

    it('should have called .setMinimumCellWidths() for left table cells', function () {
      expect(component.setMinimumCellWidths, 'Called incorrect number of times').to.have.callCount(1)
      expect(component.setMinimumCellWidths, 'Called with incorrect parameters').to.have.been.calledWithExactly(
        '.frost-fixed-table-left .frost-scroll'
      )
    })

    it('should have called .alignColumns() for left table cells', function () {
      expect(component.alignColumns, 'Called incorrect number of times').to.have.callCount(1)
      expect(component.alignColumns, 'Called with incorrect parameters').to.have.been.calledWithExactly(
        '.frost-fixed-table-header-left',
        '.frost-fixed-table-left .frost-scroll'
      )
    })

    it('should have set left header section minimum width', function () {
      expect(leftHeaderStub.css, 'Called incorrect number of times').to.have.callCount(1)
      expect(leftHeaderStub.css, 'Called with incorrect parameters').to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': `${RETURNED_WIDTH}px`
      })
    })

    it('should have set left body section minimum width', function () {
      expect(leftBodyStub.css, 'Called incorrect number of times').to.have.callCount(1)
      expect(leftBodyStub.css, 'Called with incorrect parameters').to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': `${RETURNED_WIDTH}px`
      })
    })
  })

  describe('.setupMiddleWidths()', function () {
    const RETURNED_WIDTH = 200
    let middleBodyStub, middleBodyScrollStub, middleHeaderStub, middleHeaderScrollStub, middleBodyRowStub
    beforeEach(function () {
      middleBodyStub = createSelectorStub('css')
      middleBodyScrollStub = createSelectorStub('parent')
      middleHeaderStub = createSelectorStub('css')
      middleHeaderScrollStub = createSelectorStub('parent')
      middleBodyRowStub = createSelectorStub('css')
      middleBodyScrollStub.parent.returns(middleBodyStub)
      middleHeaderScrollStub.parent.returns(middleHeaderStub)

      sandbox.stub(component, 'alignColumns')
        .returns(RETURNED_WIDTH)
      sandbox.stub(component, 'setMinimumCellWidths')
      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-middle .frost-scroll').returns(middleBodyScrollStub)
        .withArgs('.frost-fixed-table-middle .frost-scroll .frost-table-row').returns(middleBodyRowStub)
        .withArgs('.frost-fixed-table-header-middle .frost-scroll').returns(middleHeaderScrollStub)

      component.setProperties({columns})
      component.setupMiddleWidths()
    })

    it('should have called .setMinimumCellWidths() for middle table cells', function () {
      expect(component.setMinimumCellWidths, 'Called incorrect number of times').to.have.callCount(1)
      expect(component.setMinimumCellWidths, 'Called with incorrect parameters').to.have.been.calledWithExactly(
        '.frost-fixed-table-middle .frost-scroll'
      )
    })

    it('should have called .alignColumns() for middle table cells', function () {
      expect(component.alignColumns, 'Called incorrect number of times').to.have.callCount(1)
      expect(component.alignColumns, 'Called with incorrect parameters').to.have.been.calledWithExactly(
        '.frost-fixed-table-header-middle .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll'
      )
    })

    it('should have set middle header section minimum width', function () {
      expect(middleHeaderStub.css, 'Called incorrect number of times').to.have.callCount(1)
      expect(middleHeaderStub.css, 'Called with incorrect parameters').to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 1,
        'flex-basis': `${RETURNED_WIDTH}px`
      })
    })

    it('should have set middle body section minimum width', function () {
      expect(middleBodyStub.css, 'Called incorrect number of times').to.have.callCount(1)
      expect(middleBodyStub.css, 'Called with incorrect parameters').to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 1,
        'flex-basis': `${RETURNED_WIDTH}px`
      })
    })

    it('should have set middle rows minimum width', function () {
      expect(middleBodyRowStub.css, 'Called incorrect number of times').to.have.callCount(1)
      expect(middleBodyRowStub.css, 'Called with incorrect parameters').to.have.been.calledWithExactly(
        'min-width',
        `${RETURNED_WIDTH}px`
      )
    })
  })

  describe('.setupRightWidths()', function () {
    const RETURNED_WIDTH = 300
    let rightBodyStub, rightBodyScrollStub, rightHeaderStub
    beforeEach(function () {
      rightBodyStub = createSelectorStub('css')
      rightBodyScrollStub = createSelectorStub('parent')
      rightHeaderStub = createSelectorStub('css')
      rightBodyScrollStub.parent.returns(rightBodyStub)

      sandbox.stub(component, 'alignColumns')
        .returns(RETURNED_WIDTH)
      sandbox.stub(component, 'setMinimumCellWidths')
      sandbox.stub(component, '$')
        .withArgs('.frost-fixed-table-right .frost-scroll').returns(rightBodyScrollStub)
        .withArgs('.frost-fixed-table-header-right').returns(rightHeaderStub)

      component.setProperties({columns})
      component.setupRightWidths()
    })

    it('should have called .setMinimumCellWidths() for left table cells', function () {
      expect(component.setMinimumCellWidths, 'Called incorrect number of times').to.have.callCount(1)
      expect(component.setMinimumCellWidths, 'Called with incorrect parameters').to.have.been.calledWithExactly(
        '.frost-fixed-table-right .frost-scroll'
      )
    })

    it('should have called .alignColumns() for left table cells', function () {
      expect(component.alignColumns, 'Called incorrect number of times').to.have.callCount(1)
      expect(component.alignColumns, 'Called with incorrect parameters').to.have.been.calledWithExactly(
        '.frost-fixed-table-header-right',
        '.frost-fixed-table-right .frost-scroll'
      )
    })

    it('should have set left header section minimum width', function () {
      expect(rightHeaderStub.css, 'Called incorrect number of times').to.have.callCount(1)
      expect(rightHeaderStub.css, 'Called with incorrect parameters').to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': `${RETURNED_WIDTH}px`
      })
    })

    it('should have set left body section minimum width', function () {
      expect(rightBodyStub.css, 'Called incorrect number of times').to.have.callCount(1)
      expect(rightBodyStub.css, 'Called with incorrect parameters').to.have.been.calledWithExactly({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': `${RETURNED_WIDTH}px`
      })
    })
  })

  describe('.setupScrollSync()', function () {
    beforeEach(function () {
      sandbox.stub(component, 'syncScrollLeft')
      sandbox.stub(component, 'syncScrollTop')

      component.setupScrollSync()
    })

    it('should setup horizontal syncing from header middle to body middle', function () {
      expect(component.syncScrollLeft).to.have.been.calledWith(
        '.frost-fixed-table-header-middle .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll'
      )
    })

    it('should setup horizontal syncing from body middle to header middle', function () {
      expect(component.syncScrollLeft).to.have.been.calledWith(
        '.frost-fixed-table-middle .frost-scroll',
        '.frost-fixed-table-header-middle .frost-scroll'
      )
    })

    it('should setup vertical syncing from body left to body middle and right', function () {
      expect(component.syncScrollTop).to.have.been.calledWith(
        '.frost-fixed-table-left .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll',
        '.frost-fixed-table-right .frost-scroll'
      )
    })

    it('should setup vertical syncing from body middle to body left and right', function () {
      expect(component.syncScrollTop).to.have.been.calledWith(
        '.frost-fixed-table-middle .frost-scroll',
        '.frost-fixed-table-left .frost-scroll',
        '.frost-fixed-table-right .frost-scroll'
      )
    })

    it('should setup vertical syncing from body right to body left and middle', function () {
      expect(component.syncScrollTop).to.have.been.calledWith(
        '.frost-fixed-table-right .frost-scroll',
        '.frost-fixed-table-left .frost-scroll',
        '.frost-fixed-table-middle .frost-scroll'
      )
    })
  })

  describe('.syncScrollLeft()', function () {
    let srcStub, scrollHandler
    beforeEach(function () {
      srcStub = createSelectorStub('on', 'scrollLeft')
      sandbox.stub(component, '$').withArgs('src').returns(srcStub)
      component.syncScrollLeft('src', 'dst1', 'dst2', 'dst3')
      scrollHandler = srcStub.on.lastCall.args[1]
    })

    it('should lookup the source DOM element', function () {
      expect(component.$).to.have.been.calledWith('src')
    })

    it('should add a scroll event handler to the source DOM element', function () {
      expect(srcStub.on).to.have.been.calledWith('scroll', sinon.match.func)
    })

    describe('when the scroll even handler is called', function () {
      let dst1Stub, dst2Stub, dst3Stub
      beforeEach(function () {
        dst1Stub = createSelectorStub('scrollLeft')
        dst2Stub = createSelectorStub('scrollLeft')
        dst3Stub = createSelectorStub('scrollLeft')
        component.$.withArgs('dst1').returns(dst1Stub)
        component.$.withArgs('dst2').returns(dst2Stub)
        component.$.withArgs('dst3').returns(dst3Stub)

        srcStub.scrollLeft.returns(321)

        component.$.reset() // forget previous call
        scrollHandler()
      })

      it('should lookup the src DOM again', function () {
        expect(component.$).to.have.been.calledWith('src')
      })

      it('should set scrollLeft on the first destination', function () {
        expect(dst1Stub.scrollLeft).to.have.been.calledWith(321)
      })

      it('should set scrollLeft on the second destination', function () {
        expect(dst2Stub.scrollLeft).to.have.been.calledWith(321)
      })

      it('should set scrollLeft on the third destination', function () {
        expect(dst3Stub.scrollLeft).to.have.been.calledWith(321)
      })
    })
  })

  describe('.syncScrollTop()', function () {
    let srcStub, scrollHandler
    beforeEach(function () {
      srcStub = createSelectorStub('on', 'scrollTop')
      sandbox.stub(component, '$').withArgs('src').returns(srcStub)
      component.syncScrollTop('src', 'dst1', 'dst2', 'dst3')
      scrollHandler = srcStub.on.lastCall.args[1]
    })

    it('should lookup the source DOM element', function () {
      expect(component.$).to.have.been.calledWith('src')
    })

    it('should add a scroll event handler to the source DOM element', function () {
      expect(srcStub.on).to.have.been.calledWith('scroll', sinon.match.func)
    })

    describe('when the scroll even handler is called', function () {
      let dst1Stub, dst2Stub, dst3Stub
      beforeEach(function () {
        dst1Stub = createSelectorStub('scrollTop')
        dst2Stub = createSelectorStub('scrollTop')
        dst3Stub = createSelectorStub('scrollTop')
        component.$.withArgs('dst1').returns(dst1Stub)
        component.$.withArgs('dst2').returns(dst2Stub)
        component.$.withArgs('dst3').returns(dst3Stub)

        srcStub.scrollTop.returns(123)

        component.$.reset() // forget previous call
        scrollHandler()
      })

      it('should lookup the src DOM again', function () {
        expect(component.$).to.have.been.calledWith('src')
      })

      it('should set scrollTop on the first destination', function () {
        expect(dst1Stub.scrollTop).to.have.been.calledWith(123)
      })

      it('should set scrollTop on the second destination', function () {
        expect(dst2Stub.scrollTop).to.have.been.calledWith(123)
      })

      it('should set scrollTop on the third destination', function () {
        expect(dst3Stub.scrollTop).to.have.been.calledWith(123)
      })
    })
  })

  describe('.getColIndex()', function () {
    describe('selection is enabled', function () {
      beforeEach(function () {
        component.setProperties({
          onSelectionChange: () => {}
        })
      })

      it('should increment passed number', function () {
        expect(component.getColIndex(1)).to.eql(2)
      })
    })

    describe('selection not enabled', function () {
      it('should return passed number', function () {
        expect(component.getColIndex(1)).to.eql(1)
      })
    })
  })

  describe('onCallback', function () {
    let onCallback
    beforeEach(function () {
      onCallback = component.get('onCallback')
    })

    it('should default to a function', function () {
      // Normally this would be overridden, but we execute it so that coverage hs satisfied.
      expect(onCallback()).to.equal(undefined)
    })
  })
})
