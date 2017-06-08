/**
 * Integration test for the frost-table-body component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$, get} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

import {columns, heroes} from './data'

const test = integration('frost-table-body')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    this.setProperties({
      columns,
      heroes,
      myHook: 'myTableBody',
      onCallback: () => {}
    })
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-body
          columns=columns
          hook=myHook
          items=heroes
          onCallback=onCallback
        }}
      `)

      return wait()
    })

    it('should render the proper number of rows', function () {
      expect($hook('myTableBody-row')).to.have.length(heroes.length)
    })

    it('should display proper cell data', function () {
      const cellData = $hook('myTableBody-row-cell').toArray().map((el) => $(el).text().trim())

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
