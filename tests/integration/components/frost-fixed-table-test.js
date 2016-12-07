/**
 * Integration test for the frost-fixed-table component
 */

import {expect} from 'chai'
import hbs from 'htmlbars-inline-precompile'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'
import {fixedColumns, heroes} from './data'

const test = integration('frost-fixed-table')
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
            it(`should set a hook on the cell in row: ${rowIndex}, column: ${columnIndex}`, function () {
              const $cell = $hook('myTable-middle-cell', {row: rowIndex, column: columnIndex})
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
            it(`should set a hook on the cell in row: ${rowIndex}, column: ${columnIndex}`, function () {
              const $cell = $hook('myTable-right-cell', {row: rowIndex, column: columnIndex})
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
})
