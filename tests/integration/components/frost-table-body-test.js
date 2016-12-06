/**
 * Integration test for the frost-table-body component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$, get} = Ember
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {$hook, initialize as initializeHook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/describe-component'
import {columns, heroes} from './data'

describeComponent(...integration('frost-table-body'), function () {
  beforeEach(function () {
    initializeHook()
    this.setProperties({
      columns,
      heroes,
      myHook: 'myTableBody'
    })
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-body
          columns=columns
          hook=myHook
          items=heroes
        }}
      `)

      return wait()
    })

    it('should render the proper number of rows', function () {
      expect($hook('myTableBody-row')).to.have.length(heroes.length)
    })

    it('should display proper cell data', function () {
      const cellData = $hook('myTableBody-row-cell').toArray().map((el) => $(el).text())

      const expected = []
      heroes.forEach((hero) => {
        columns.forEach((col) => {
          expected.push(get(hero, col.propertyName))
        })
      })

      expect(cellData).to.eql(expected)
    })
  })
})
