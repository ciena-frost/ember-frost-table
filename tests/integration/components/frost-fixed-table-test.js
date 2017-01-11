/**
 * Integration test for the frost-fixed-table component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {fixedColumns, fixedColumnsWithCustomRenderers, heroes} from './data'
import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-fixed-table', ['text-input-renderer'])

describe(test.label, function () {
  test.setup()

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    this.setProperties({
      fixedColumns,
      heroes,
      myHook: 'myTable'
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('after render', function () {
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
            const colIndex = columnIndex + 1
            it(`should set a hook with a unique column index of ${colIndex}
                on the cell in row: ${rowIndex}, column: ${columnIndex})
                of the middle section
                `, function () {
              const $cell = $hook('myTable-middle-cell', {row: rowIndex, column: colIndex})
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
            const colIndex = columnIndex + 5
            it(`should set a hook with a unique column index of ${colIndex}
                on the cell in row: ${rowIndex}, column: ${columnIndex})
                of the right section
                `, function () {
              const $cell = $hook('myTable-right-cell', {row: rowIndex, column: colIndex})
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

  describe('events', function () {
    let dispatcher

    beforeEach(function () {
      dispatcher = sandbox.stub()
      this.setProperties({
        actions: {dispatcher},
        fixedColumns: fixedColumnsWithCustomRenderers
      })

      this.render(hbs`
        {{frost-fixed-table
          callbackHandler=(action 'dispatcher')
          columns=fixedColumns
          hook=myHook
          items=heroes
        }}
      `)

      return wait()
    })

    describe('the header', function () {
      const headerRow = -1  // differentiates from data row 0

      describe('the left section', function () {
        describe('when an event is triggered by a renderer', function () {
          beforeEach(function () {
            // FIXME: Fix this to use qualifiers on '...renderer-input' hook
            // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
            const cellRenderer = $hook('myTable-header-left-cell-renderer', {column: 0})
            $('input', cellRenderer).val('foo').trigger('input')
            return wait()
          })

          it('it should be emitted by the table', function () {
            expect(dispatcher).to.have.been.calledWith('input', headerRow, 0, 'foo')
          })
        })
      })

      describe('the middle section', function () {
        const middleColumns = fixedColumnsWithCustomRenderers.slice(1, 3)
        middleColumns.forEach((column, middleColIndex) => {
          const colIndex = middleColIndex + 1  // offset by single left column
          describe(`when the renderer for column ${colIndex} triggers an event`, function () {
            beforeEach(function () {
              // FIXME: Fix this to use qualifiers on '...renderer-input' hook
              const cellRenderer = $hook('myTable-header-middle-cell-renderer', {column: colIndex})
              $('input', cellRenderer).val('foo').trigger('input')
              return wait()
            })

            it('it should be emitted by the table', function () {
              expect(dispatcher).to.have.been.calledWith('input', headerRow, colIndex, 'foo')
            })
          })
        })
      })

      describe('the right section', function () {
        describe('when an event is triggered by a renderer', function () {
          beforeEach(function () {
            // FIXME: Fix this to use qualifiers on '...renderer-input' hook
            const cellRenderer = $hook('myTable-header-right-cell-renderer', {column: 3})
            $('input', cellRenderer).val('foo').trigger('input')
            return wait()
          })

          it('it should be emitted by the table (with global column index 3)', function () {
            expect(dispatcher).to.have.been.calledWith('input', headerRow, 3, 'foo')
          })
        })
      })
    })

    describe('the body', function () {
      describe('the left section', function () {
        const leftColumns = fixedColumnsWithCustomRenderers.slice(0, 1)

        heroes.forEach((hero, rowIndex) => {
          leftColumns.forEach((column, columnIndex) => {
            describe(`when an event is triggered from the cell in
                      row: ${rowIndex}, column: ${columnIndex}`, function () {
              beforeEach(function () {
                // FIXME: Fix this to use qualifiers on '...renderer-input' hook
                // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
                const cellRenderer = $hook('myTable-left-cell-renderer', {row: rowIndex, column: columnIndex})
                $('input', cellRenderer).val('foo').trigger('input')
                return wait()
              })

              it('it should be emitted by the table', function () {
                expect(dispatcher).to.have.been.calledWith('input', rowIndex, columnIndex, 'foo')
              })
            })
          })
        })
      })

      describe('the middle section', function () {
        const middleColumns = fixedColumnsWithCustomRenderers.slice(1, 3)

        heroes.forEach((hero, rowIndex) => {
          middleColumns.forEach((column, columnIndex) => {
            const colIndex = columnIndex + 1  // left column count offsets all of our hooks + events
            describe(`when an event is triggered from the cell in
                      row: ${rowIndex}, column: ${columnIndex}`, function () {
              beforeEach(function () {
                // FIXME: Fix this to use qualifiers on '...renderer-input' hook
                // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
                const cellRenderer = $hook('myTable-middle-cell-renderer', {row: rowIndex, column: colIndex})
                $('input', cellRenderer).val('foo').trigger('input')
                return wait()
              })

              it(`it should be emitted by the table (with global column index ${colIndex})`, function () {
                expect(dispatcher).to.have.been.calledWith('input', rowIndex, colIndex, 'foo')
              })
            })
          })
        })
      })

      describe('the right section', function () {
        const rightColumns = fixedColumnsWithCustomRenderers.slice(3)

        heroes.forEach((hero, rowIndex) => {
          rightColumns.forEach((column, columnIndex) => {
            const colIndex = columnIndex + 3  // left + right column count offsets all of our hooks + events
            describe(`when an event is triggered from the cell in
                      row: ${rowIndex}, column: ${columnIndex}`, function () {
              beforeEach(function () {
                // FIXME: Fix this to use qualifiers on '...renderer-input' hook
                // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
                const cellRenderer = $hook('myTable-right-cell-renderer', {row: rowIndex, column: colIndex})
                $('input', cellRenderer).val('foo').trigger('input')
                return wait()
              })

              it(`it should be emitted by the table (with global column index ${colIndex})`, function () {
                expect(dispatcher).to.have.been.calledWith('input', rowIndex, colIndex, 'foo')
              })
            })
          })
        })
      })
    })
  })
})
