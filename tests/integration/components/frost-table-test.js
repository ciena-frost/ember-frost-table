/**
 * Integration test for the frost-table component
 */
/* global server */

import {expect} from 'chai'
import Ember from 'ember'
const {$, A, copy, get} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {columns, columnsWithCustomRenderers, heroes} from './data'
import {startMirage, stopMirage} from 'dummy/tests/helpers/mirage'
import {
  assertRowsSelected,
  rowBodyRangeSelect,
  rowBodySingleSelect,
  rowCheckboxRangeSelect,
  rowCheckboxSingleSelect
} from 'dummy/tests/helpers/selection'

const test = integration('frost-table')
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
        columns,
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

  describe('after rendering with raw objects', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table
          columns=columns
          hook=myHook
          items=heroes
        }}
      `)

      return wait()
    })

    it('should have an element', function () {
      expect(this.$()).to.have.length(1)
    })

    it('should render a header', function () {
      expect($hook('myTable-header')).to.have.length(1)
    })

    it('should give the header the set of columns', function () {
      const columnNames = $hook('myTable-header-cell').toArray().map((el) => $(el).text().trim())
      expect(columnNames).to.eql(columns.map((col) => col.label))
    })

    it('should render a body', function () {
      expect($hook('myTable-body')).to.have.length(1)
    })

    it('should be able to grab a cell via a hook', function () {
      const expected = get(heroes[1], columns[1].propertyName)
      expect($hook('myTable-body-row-cell', {row: 1, column: 1}).text().trim()).to.equal(expected)
    })
  })

  describe('after rendering with ember data result array', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table
          columns=columns
          hook=myHook
          items=characters
        }}
      `)

      return wait()
    })

    it('should have an element', function () {
      expect(this.$()).to.have.length(1)
    })

    it('should render a header', function () {
      expect($hook('myTable-header')).to.have.length(1)
    })

    it('should give the header the set of columns', function () {
      const columnNames = $hook('myTable-header-cell').toArray().map((el) => $(el).text().trim())
      expect(columnNames).to.eql(columns.map((col) => col.label))
    })

    it('should render a body', function () {
      expect($hook('myTable-body')).to.have.length(1)
    })

    it('should be able to grab a cell via a hook', function () {
      const expected = get(heroes[1], columns[1].propertyName)
      expect($hook('myTable-body-row-cell', {row: 1, column: 1}).text().trim()).to.equal(expected)
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
        {{frost-table
          columns=columns
          hook='myTable'
          items=heroes
          itemKey='name'
          selectedItems=selectedItems
          onSelectionChange=(action 'onSelectionChange')
        }}
      `)

      return wait()
    })

    it('should have "selectable" class on rows', function () {
      expect(this.$('.frost-table-row')).to.have.class('selectable')
    })

    it('should not have "is-selected" class on row', function () {
      expect(this.$('.frost-table-row')).to.not.have.class('is-selected')
    })

    it('should have selection checkboxes on first column', function () {
      expect($hook('myTable-body-row-selectionCell')).to.have.length(heroes.length)
    })

    it('should have clear selection cell on header', function () {
      expect($hook('myTable-header-selectionCell')).to.have.length(1)
    })

    describe('selecting single checkbox', function () {
      beforeEach(function () {
        rowCheckboxSingleSelect('myTable-body-row', 0)
        return wait()
      })

      it('should have first row in selected state', function () {
        assertRowsSelected('myTable-body-row', 0)
      })
    })

    describe('selecting single table row body', function () {
      beforeEach(function () {
        rowBodySingleSelect('myTable-body-row', 0)
        return wait()
      })

      it('should have first row in selected state', function () {
        assertRowsSelected('myTable-body-row', 0)
      })
    })

    describe('selecting a range of checkboxes', function () {
      beforeEach(function () {
        rowCheckboxRangeSelect('myTable-body-row', 0, 4)
        return wait()
      })

      it('should have first 5 rows in selected state', function () {
        assertRowsSelected('myTable-body-row', 0, 1, 2, 3, 4)
      })
    })

    describe('selecting a range of table row bodies', function () {
      beforeEach(function () {
        rowBodyRangeSelect('myTable-body-row', 0, 4)
        return wait()
      })

      it('should have first 5 rows in selected state', function () {
        assertRowsSelected('myTable-body-row', 0, 1, 2, 3, 4)
      })
    })

    describe('selecting multiple row checkboxes', function () {
      beforeEach(function () {
        rowCheckboxSingleSelect('myTable-body-row', 0)
        rowCheckboxSingleSelect('myTable-body-row', 1)
        return wait()
      })

      it('should have selected state for both rows', function () {
        assertRowsSelected('myTable-body-row', 0, 1)
      })
    })

    describe('selecting multiple row bodies', function () {
      beforeEach(function () {
        rowBodySingleSelect('myTable-body-row', 0)
        rowBodySingleSelect('myTable-body-row', 1)
        return wait()
      })

      it('should have only the second row in selected state', function () {
        assertRowsSelected('myTable-body-row', 1)
      })
    })

    describe('clearing the selection', function () {
      beforeEach(function () {
        rowBodySingleSelect('myTable-body-row', 0)
        return wait().then(() => {
          assertRowsSelected('myTable-body-row', 0)
          $hook('myTable-header-selectionCell').click()
          return wait()
        })
      })

      it('should not have any row be selected', function () {
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
        columns: columnsWithCustomRenderers,
        onCallback,
        // deep copy the array as to not overwrite the heroes data for other tests
        heroes: heroes.map(function (item) { return copy(item, true) })
      })

      this.render(hbs`
      {{frost-table
        onCallback=(action onCallback)
        columns=columns
        hook=myHook
        items=heroes
      }}
    `)

      return wait()
    })

    describe('the header', function () {
      const headerRow = -1 // differentiates from data row 0

      columnsWithCustomRenderers.forEach((column, index) => {
        describe(`when the renderer for column ${index} triggers an event`, function () {
          beforeEach(function () {
            // FIXME: Fix this to use qualifiers on '...renderer-input' hook
            const $cellRenderer = $hook('myTable-header-cell-renderer', {column: index})
            $('input', $cellRenderer).val('foo').trigger('input')
            return wait()
          })

          it('should be emitted by the table', function () {
            expect(onCallback).to.have.been.calledWith(_action({row: headerRow, col: index}))
          })
        })
      })
    })

    describe('the body', function () {
      heroes.forEach((hero, rowIndex) => {
        columnsWithCustomRenderers.forEach((column, index) => {
          describe(`when an event is triggered from the cell in row: ${rowIndex}, column: ${index}`, function () {
            beforeEach(function () {
              // FIXME: Fix this to use qualifiers on '...renderer-input' hook
              // the renderer has a hook, but the input inside of it doesn't have the right qualifiers.
              const $cellRenderer = $hook('myTable-body-row-cell-renderer', {row: rowIndex, column: index})
              $('input', $cellRenderer).val('foo').trigger('input')
              return wait()
            })

            it(`it should be emitted by the table (with global column index ${index})`, function () {
              expect(onCallback).to.have.been.calledWith(_action({row: rowIndex, col: index}))
            })
          })
        })
      })
    })
  })
})
