/**
 * Integration test for the frost-table-body-row component
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

const test = integration('frost-table-body-row')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
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
