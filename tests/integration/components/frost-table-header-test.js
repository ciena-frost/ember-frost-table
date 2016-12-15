/**
 * Integration test for the frost-table-header component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'
import {columns} from './data'

const test = integration('frost-table-header')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    this.setProperties({
      columns,
      myHook: 'myTableHeader'
    })
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-header
          columns=columns
          hook=myHook
        }}
      `)

      return wait()
    })

    it('should display proper column labels', function () {
      const columnNames = $hook('myTableHeader-cell').toArray().map((el) => $(el).text())
      expect(columnNames).to.eql(columns.map((col) => col.label))
    })
  })
})
