/**
 * Integration test for the frost-table-header component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$} = Ember
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {$hook, initialize as initializeHook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe} from 'mocha'

import {integration} from 'dummy/tests/helpers/ember-test-utils/describe-component'
import {columns} from './data'

describeComponent(...integration('frost-table-header'), function () {
  beforeEach(function () {
    initializeHook()
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
