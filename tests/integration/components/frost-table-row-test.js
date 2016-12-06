/**
 * Integration test for the frost-table-body-row component
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

describeComponent(...integration('frost-table-body-row'), function () {
  beforeEach(function () {
    initializeHook()
    this.setProperties({
      columns,
      hero: heroes[2],
      myHook: 'myTableRow'
    })
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-row
          columns=columns
          hook=myHook
          item=hero
        }}
      `)

      return wait()
    })

    it('should display proper cell data', function () {
      const cellData = $hook('myTableRow-cell').toArray().map((el) => $(el).text())

      const expected = []
      columns.forEach((col) => {
        expected.push(get(heroes[2], col.propertyName))
      })

      expect(cellData).to.eql(expected)
    })
  })
})
