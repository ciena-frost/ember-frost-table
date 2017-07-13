/**
 * Integration test for the frost-table component
 */
/* global server */

import {expect} from 'chai'
import Ember from 'ember'
const {$, A, get} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {columns, columnsWithCustomRenderers, heroes} from './data'
import {startMirage, stopMirage} from 'dummy/tests/helpers/mirage'

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

  describe('after render with selection functionality', function () {
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

    it('rows should have "selectable" class', function () {
      expect(this.$('.frost-table-row')).to.have.class('selectable')
    })

    it('no row has "is-selected" class', function () {
      expect(this.$('.frost-table-row')).to.not.have.class('is-selected')
    })

    it('first column has selection checkboxes', function () {
      expect($hook('myTable-header-selectionCell')).to.have.length(1)
      expect($hook('myTable-body-row-selectionCell')).to.have.length(heroes.length)
    })

    let assertFirstRowSelected = () => {
      const rows = $hook('myTable-body-row')
      expect(rows.slice(0, 1)).to.have.class('is-selected')
      expect(rows.slice(1)).to.not.have.class('is-selected')
    }

    describe('selecting table row checkbox', function () {
      beforeEach(function () {
        $hook('myTable-body-row-selectionCell-checkbox-checkbox-input').eq(0).click()
        return wait()
      })

      it('first row is in selected state', function () {
        assertFirstRowSelected()
      })
    })

    describe('selecting the table row', function () {
      beforeEach(function () {
        // debugger
        $hook('myTable-body-row').eq(0).click()
        return wait()
      })

      it('first row is in selected state', function () {
        assertFirstRowSelected()
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
        onCallback
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
      const headerRow = -1  // differentiates from data row 0

      columnsWithCustomRenderers.forEach((column, index) => {
        describe(`when the renderer for column ${index} triggers an event`, function () {
          beforeEach(function () {
            // FIXME: Fix this to use qualifiers on '...renderer-input' hook
            const $cellRenderer = $hook('myTable-header-cell-renderer', {column: index})
            $('input', $cellRenderer).val('foo').trigger('input')
            return wait()
          })

          it('it should be emitted by the table', function () {
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
