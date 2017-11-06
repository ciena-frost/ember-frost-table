/**
 * Integration test for the frost-fixed-table component
 */
/* global server */

import {expect} from 'chai'
import Ember from 'ember'
const {$, A, copy} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {fixedColumns, fixedColumnsWithCustomRenderers, heroes} from './data'
import {startMirage, stopMirage} from 'dummy/tests/helpers/mirage'
import {
  assertRowsSelected,
  rowBodyRangeSelect,
  rowBodySingleSelect,
  rowCheckboxRangeSelect,
  rowCheckboxSingleSelect
} from 'dummy/tests/helpers/selection'

const test = integration('frost-fixed-table')
describe(test.label, function () {
  test.setup()

  let sandbox

  beforeEach(function (done) {
    sandbox = sinon.sandbox.create()
    startMirage(this.container)
    heroes.forEach((hero) => {
      server.create('character', hero)
    })

    this.store = this.container.lookup('service:store')
    this.store.findAll('character').then((characters) => {
      this.setProperties({
        characters,
        fixedColumns,
        heroes,
        myHook: 'myTable'
      })

      done()
    })
  })

  afterEach(function () {
    sandbox.restore()
    stopMirage()
  })

  describe('after render with normal objects', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-fixed-table
          columns=fixedColumns
          hook=myHook
          items=heroes
        }}
      `)

      return wait()
    })

    it('should create the header', function () {
      expect(this.$('.frost-fixed-table-header')).to.have.length(1)
    })

    it('should create the body', function () {
      expect(this.$('.frost-fixed-table-body')).to.have.length(1)
    })

    it('should set the hook of the body', function () {
      expect($hook('myTable-body')).to.have.class('frost-fixed-table-body')
    })

    it('should not use <tbody>', function () {
      expect(this.$('tbody')).to.have.length(0)
    })

    describe('the header', function () {
      let $header
      beforeEach(function () {
        $header = $hook('myTable-header')
      })

      it('should be accessible via a hook', function () {
        expect($header).to.have.length(1)
      })

      it('should create a left section', function () {
        expect($header.find('.frost-fixed-table-header-left')).to.have.length(1)
      })

      it('should create a middle section', function () {
        expect($header.find('.frost-fixed-table-header-middle')).to.have.length(1)
      })

      it('should create a right section', function () {
        expect($header.find('.frost-fixed-table-header-right')).to.have.length(1)
      })

      it('should have a header cell per column', function () {
        expect($header.find('.frost-table-header-cell')).to.have.length(fixedColumns.length)
      })

      describe('the left section', function () {
        let $leftWrapper, $left
        beforeEach(function () {
          $leftWrapper = $header.find('.frost-fixed-table-header-left')
          $left = $hook('myTable-header-left')
        })

        it('should be accessible via a hook', function () {
          expect($left).to.have.length(1)
        })

        it('should live within the wrapper', function () {
          expect($left.closest('.frost-fixed-table-header-left')).to.have.length(1)
        })

        it('should not have a frost-scroll wrapper', function () {
          expect($leftWrapper.find('.frost-scroll')).to.have.length(0)
        })

        it('should be a frost-table-header', function () {
          expect($left).to.have.class('frost-table-header')
        })

        it('should not use <thead>', function () {
          expect($leftWrapper.find('thead')).to.have.length(0)
        })

        it('should not use <th>', function () {
          expect($leftWrapper.find('th')).to.have.length(0)
        })
      })

      describe('the middle section', function () {
        let $middleWrapper, $middle
        beforeEach(function () {
          $middleWrapper = $header.find('.frost-fixed-table-header-middle')
          $middle = $hook('myTable-header-middle')
        })

        it('should be accessible via a hook', function () {
          expect($middle).to.have.length(1)
        })

        it('should live within the wrapper', function () {
          expect($middle.closest('.frost-fixed-table-header-middle')).to.have.length(1)
        })

        it('should have a frost-scroll wrapper', function () {
          expect($middleWrapper.find('.frost-scroll')).to.have.length(1)
        })

        it('should be a frost-table-header', function () {
          expect($middle).to.have.class('frost-table-header')
        })

        it('should not use <thead>', function () {
          expect($middleWrapper.find('thead')).to.have.length(0)
        })

        it('should not use <th>', function () {
          expect($middleWrapper.find('th')).to.have.length(0)
        })
      })

      describe('the right section', function () {
        let $rightWrapper, $right
        beforeEach(function () {
          $rightWrapper = $header.find('.frost-fixed-table-header-right')
          $right = $hook('myTable-header-right')
        })

        it('should be accessible via a hook', function () {
          expect($right).to.have.length(1)
        })

        it('should live within the wrapper', function () {
          expect($right.closest('.frost-fixed-table-header-right')).to.have.length(1)
        })

        it('should not have a frost-scroll wrapper', function () {
          expect($rightWrapper.find('.frost-scroll')).to.have.length(0)
        })

        it('should be a frost-table-header', function () {
          expect($right).to.have.class('frost-table-header')
        })

        it('should not use <thead>', function () {
          expect($rightWrapper.find('thead')).to.have.length(0)
        })

        it('should not use <th>', function () {
          expect($rightWrapper.find('th')).to.have.length(0)
        })
      })
    })

    describe('the body', function () {
      let $body
      beforeEach(function () {
        $body = $hook('myTable-body')
      })

      it('should be accessible via a hook', function () {
        expect($body).to.have.length(1)
      })

      it('should create a left section', function () {
        expect($body.find('.frost-fixed-table-left')).to.have.length(1)
      })

      it('should create a middle section', function () {
        expect($body.find('.frost-fixed-table-middle')).to.have.length(1)
      })

      it('should create a right section', function () {
        expect($body.find('.frost-fixed-table-right')).to.have.length(1)
      })

      it('should have a three rows per item', function () {
        expect($body.find('.frost-table-row')).to.have.length(heroes.length * 3)
      })

      describe('the left section', function () {
        const leftColumns = fixedColumns.slice(0, 1)
        let $leftWrapper, $left

        beforeEach(function () {
          $leftWrapper = $body.find('.frost-fixed-table-left')
          $left = $hook('myTable-left')
        })

        it('should have a cell for each left column for each item', function () {
          expect($left.find('.frost-table-cell')).to.have.length(heroes.length * leftColumns.length)
        })

        heroes.forEach((hero, rowIndex) => {
          leftColumns.forEach((column, columnIndex) => {
            it(`should set a hook on the cell in row: ${rowIndex}, column: ${columnIndex}`, function () {
              const $cell = $hook('myTable-left-cell', {row: rowIndex, column: columnIndex})
              expect($cell.text().trim()).to.equal(hero[column.propertyName])
            })
          })
        })

        it('should live within the wrapper', function () {
          expect($left.closest('.frost-fixed-table-left')).to.have.length(1)
        })

        it('should have a frost-scroll wrapper', function () {
          expect($leftWrapper.find('.frost-scroll')).to.have.length(1)
        })

        it('should be a frost-table-row', function () {
          expect($left).to.have.class('frost-table-row')
        })

        it('should not use <td>', function () {
          expect($leftWrapper.find('td')).to.have.length(0)
        })
      })

      describe('the middle section', function () {
        const middleColumns = fixedColumns.slice(1, 5)
        let $middleWrapper, $middle

        beforeEach(function () {
          $middleWrapper = $body.find('.frost-fixed-table-middle')
          $middle = $hook('myTable-middle')
        })

        it('should have a cell for each middle column for each item', function () {
          expect($middle.find('.frost-table-cell')).to.have.length(heroes.length * middleColumns.length)
        })

        heroes.forEach((hero, rowIndex) => {
          middleColumns.forEach((column, columnIndex) => {
            // The fixed table uses column indices that are unique across left/middle/right,
            // so we expect to find hooks and event index identifiers that start with an index
            // that is offset by the number of columns in the sections to the left of us.
            const globalIndex = columnIndex + 1
            const msg = `
              should set a hook with a unique column index of ${globalIndex}
              on the cell in row: ${rowIndex}, column: ${columnIndex})
              of the middle section
            `
            it(msg, function () {
              const $cell = $hook('myTable-middle-cell', {row: rowIndex, column: globalIndex})
              expect($cell.text().trim()).to.equal(hero[column.propertyName])
            })
          })
        })

        it('should live within the wrapper', function () {
          expect($middle.closest('.frost-fixed-table-middle')).to.have.length(1)
        })

        it('should have a frost-scroll wrapper', function () {
          expect($middleWrapper.find('.frost-scroll')).to.have.length(1)
        })

        it('should be a frost-table-row', function () {
          expect($middle).to.have.class('frost-table-row')
        })

        it('should not use <td>', function () {
          expect($middleWrapper.find('td')).to.have.length(0)
        })
      })

      describe('the right section', function () {
        const rightColumns = fixedColumns.slice(5)
        let $rightWrapper, $right

        beforeEach(function () {
          $rightWrapper = $body.find('.frost-fixed-table-right')
          $right = $hook('myTable-right')
        })

        it('should have a cell for each right column for each item', function () {
          expect($right.find('.frost-table-cell')).to.have.length(heroes.length * rightColumns.length)
        })

        heroes.forEach((hero, rowIndex) => {
          rightColumns.forEach((column, columnIndex) => {
            // The fixed table uses column indices that are unique across left/middle/right,
            // so we expect to find hooks and event index identifiers that start with an index
            // that is offset by the number of columns in the sections to the left of us.
            const globalIndex = columnIndex + 5
            const msg = `
              should set a hook with a unique column index of ${globalIndex}
              on the cell in row: ${rowIndex}, column: ${columnIndex})
              of the right section
            `
            it(msg, function () {
              const $cell = $hook('myTable-right-cell', {row: rowIndex, column: globalIndex})
              expect($cell.text().trim()).to.equal(hero[column.propertyName])
            })
          })
        })

        it('should live within the wrapper', function () {
          expect($right.closest('.frost-fixed-table-right')).to.have.length(1)
        })

        it('should have a frost-scroll wrapper', function () {
          expect($rightWrapper.find('.frost-scroll')).to.have.length(1)
        })

        it('should be a frost-table-row', function () {
          expect($right).to.have.class('frost-table-row')
        })

        it('should not use <td>', function () {
          expect($rightWrapper.find('td')).to.have.length(0)
        })
      })
    })
  })

  describe('after render with ember data record array', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-fixed-table
          columns=fixedColumns
          hook=myHook
          items=characters
        }}
      `)

      return wait()
    })

    it('should create the header', function () {
      expect(this.$('.frost-fixed-table-header')).to.have.length(1)
    })

    it('should create the body', function () {
      expect(this.$('.frost-fixed-table-body')).to.have.length(1)
    })

    it('should set the hook of the body', function () {
      expect($hook('myTable-body')).to.have.class('frost-fixed-table-body')
    })
  })

  describe('after rendering with selection functionality', function () {
    beforeEach(function () {
      this.setProperties({
        selectedItems: A([]),
        actions: {
          onSelectionChange (selectedItems) {
            this.get('selectedItems').setObjects(selectedItems)
          }
        }
      })
      this.render(hbs`
        {{frost-fixed-table
          columns=fixedColumns
          hook=myHook
          items=heroes
          itemKey='name'
          selectedItems=selectedItems
          onSelectionChange=(action 'onSelectionChange')
        }}
      `)

      return wait()
    })

    it('should have "selectable" class for each row', function () {
      expect(this.$('.frost-table-row')).to.have.class('selectable')
    })

    it('should have no row with "is-selected" class', function () {
      expect(this.$('.frost-table-row')).to.not.have.class('is-selected')
    })

    it('should have selection checkboxes in first coulmn', function () {
      expect($hook('myTable-left-selectionCell')).to.have.length(heroes.length)
    })

    it('should have clear selection cell in header', function () {
      expect($hook('myTable-header-left-selectionCell')).to.have.length(1)
    })

    let _assertRowsSelected = (...rows) => {
      assertRowsSelected('myTable-left', ...rows)
      assertRowsSelected('myTable-middle', ...rows)
      assertRowsSelected('myTable-right', ...rows)
    }

    describe('selecting table row checkbox', function () {
      beforeEach(function () {
        rowCheckboxSingleSelect('myTable-left', 0)
        return wait()
      })

      it('should have first row in selected state for all sections', function () {
        _assertRowsSelected(0)
      })
    })

    ;['left', 'middle', 'right'].forEach((section) => {
      describe(`selecting ${section} section row body`, function () {
        beforeEach(function () {
          rowBodySingleSelect(`myTable-${section}`, 0)
          return wait()
        })

        it('should have first row in selected state for all sections', function () {
          _assertRowsSelected(0)
        })
      })
    })

    describe('selecting a range of checkboxes', function () {
      beforeEach(function () {
        rowCheckboxRangeSelect('myTable-left', 0, 4)
        return wait()
      })

      it('should have first 5 rows in selected state for all sections', function () {
        _assertRowsSelected(0, 1, 2, 3, 4)
      })
    })

    ;['left', 'middle', 'right'].forEach((section) => {
      describe(`selecting a range of ${section} section table row bodies`, function () {
        beforeEach(function () {
          rowBodyRangeSelect(`myTable-${section}`, 0, 4)
          return wait()
        })

        it('should have first 5 rows in selected state', function () {
          _assertRowsSelected(0, 1, 2, 3, 4)
        })
      })
    })

    describe('selecting multiple row checkboxes', function () {
      beforeEach(function () {
        rowCheckboxSingleSelect('myTable-left', 0)
        rowCheckboxSingleSelect('myTable-left', 1)
        return wait()
      })

      it('should have both rows in selected state', function () {
        _assertRowsSelected(0, 1)
      })
    })

    ;['left', 'middle', 'right'].forEach((section) => {
      describe(`selecting multiple ${section} section row bodies`, function () {
        beforeEach(function () {
          rowBodySingleSelect(`myTable-${section}`, 0)
          rowBodySingleSelect(`myTable-${section}`, 1)
          return wait()
        })

        it('should only have first row in selected state', function () {
          _assertRowsSelected(1)
        })
      })
    })

    describe('clearing the selection', function () {
      beforeEach(function () {
        rowBodySingleSelect('myTable-left', 0)
        return wait().then(() => {
          _assertRowsSelected(0)
          $hook('myTable-header-left-selectionCell').click()
          return wait()
        })
      })

      it('should not have any row in selected state', function () {
        expect(this.$('.is-selected')).to.have.length(0)
      })
    })
  })

  describe('events', function () {
    let onCallback

    // helper to create {action: 'input', row, col, args: 'foo'}
    const _action = ({row, col}) => {
      return {action: 'input', row, col, args: 'foo'}
    }

    beforeEach(function () {
      onCallback = sandbox.stub()
      this.setProperties({
        onCallback,
        fixedColumns: fixedColumnsWithCustomRenderers,
        // deep copy the array as to not overwrite the heroes data for other tests
        heroes: heroes.map(function (item) { return copy(item, true) })
      })

      this.render(hbs`
        {{frost-fixed-table
          onCallback=(action onCallback)
          columns=fixedColumns
          hook=myHook
          items=heroes
        }}
      `)

      return wait()
    })

    describe('the header', function () {
      const headerRow = -1 // differentiates from data row 0

      describe('the left section', function () {
        describe('when an event is triggered by a renderer', function () {
          beforeEach(function () {
            // FIXME: Fix this to use qualifiers on '...renderer-input' hook
            // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
            const $cellRenderer = $hook('myTable-header-left-cell-renderer', {column: 0})
            $('input', $cellRenderer).val('foo').trigger('input')
            return wait()
          })

          it('should be emitted by the table', function () {
            expect(onCallback).to.have.been.calledWith(_action({row: headerRow, col: 0}))
          })
        })
      })

      describe('the middle section', function () {
        const middleColumns = fixedColumnsWithCustomRenderers.slice(1, 3)
        middleColumns.forEach((column, index) => {
          const globalIndex = index + 1 // offset by single left column
          describe(`when the renderer for column ${globalIndex} triggers an event`, function () {
            beforeEach(function () {
              // FIXME: Fix this to use qualifiers on '...renderer-input' hook
              const $cellRenderer = $hook('myTable-header-middle-cell-renderer', {column: globalIndex})
              $('input', $cellRenderer).val('foo').trigger('input')
              return wait()
            })

            it('should be emitted by the table', function () {
              expect(onCallback).to.have.been.calledWith(_action({row: headerRow, col: globalIndex}))
            })
          })
        })
      })

      describe('the right section', function () {
        describe('when an event is triggered by a renderer', function () {
          beforeEach(function () {
            // FIXME: Fix this to use qualifiers on '...renderer-input' hook
            const $cellRenderer = $hook('myTable-header-right-cell-renderer', {column: 3})
            $('input', $cellRenderer).val('foo').trigger('input')
            return wait()
          })

          it('should be emitted by the table (with global column index 3)', function () {
            expect(onCallback).to.have.been.calledWith(_action({row: headerRow, col: 3}))
          })
        })
      })
    })

    describe('the body', function () {
      describe('the left section', function () {
        const leftColumns = fixedColumnsWithCustomRenderers.slice(0, 1)

        heroes.forEach((hero, rowIndex) => {
          leftColumns.forEach((column, index) => {
            describe(`when an event is triggered from the cell in row: ${rowIndex}, column: ${index}`, function () {
              beforeEach(function () {
                // FIXME: Fix this to use qualifiers on '...renderer-input' hook
                // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
                const $cellRenderer = $hook('myTable-left-cell-renderer', {row: rowIndex, column: index})
                $('input', $cellRenderer).val('foo').trigger('input')
                return wait()
              })

              it('should be emitted by the table', function () {
                expect(onCallback).to.have.been.calledWith(_action({row: rowIndex, col: index}))
              })
            })
          })
        })
      })

      describe('the middle section', function () {
        const middleColumns = fixedColumnsWithCustomRenderers.slice(1, 3)

        heroes.forEach((hero, rowIndex) => {
          middleColumns.forEach((column, index) => {
            const globalIndex = index + 1 // left column count offsets all of our hooks + events
            describe(`when an event is triggered from the cell in row: ${rowIndex}, column: ${index}`, function () {
              beforeEach(function () {
                // FIXME: Fix this to use qualifiers on '...renderer-input' hook
                // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
                const $cellRenderer = $hook('myTable-middle-cell-renderer', {row: rowIndex, column: globalIndex})
                $('input', $cellRenderer).val('foo').trigger('input')
                return wait()
              })

              it(`should be emitted by the table (with global column index ${globalIndex})`, function () {
                expect(onCallback).to.have.been.calledWith(_action({row: rowIndex, col: globalIndex}))
              })
            })
          })
        })
      })

      describe('the right section', function () {
        const rightColumns = fixedColumnsWithCustomRenderers.slice(3)

        heroes.forEach((hero, rowIndex) => {
          rightColumns.forEach((column, index) => {
            const globalIndex = index + 3 // left + right column count offsets all of our hooks + events
            describe(`when an event is triggered from the cell in row: ${rowIndex}, column: ${index}`, function () {
              beforeEach(function () {
                // FIXME: Fix this to use qualifiers on '...renderer-input' hook
                // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
                const $cellRenderer = $hook('myTable-right-cell-renderer', {row: rowIndex, column: globalIndex})
                $('input', $cellRenderer).val('foo').trigger('input')
                return wait()
              })

              it(`should be emitted by the table (with global column index ${globalIndex})`, function () {
                expect(onCallback).to.have.been.calledWith(_action({row: rowIndex, col: globalIndex}))
              })
            })
          })
        })
      })
    })
  })
})
