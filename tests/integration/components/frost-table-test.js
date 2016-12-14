/**
 * Integration test for the frost-table component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$, get} = Ember
import hbs from 'htmlbars-inline-precompile'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'
import {columns, heroes} from './data'

const test = integration('frost-table')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    this.setProperties({
      columns,
      heroes,
      myHook: 'myTable'
    })
  })

  describe('after render', function () {
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
})
