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

import {columns} from './data'
import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-table-header')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    this.setProperties({
      columns,
      myHook: 'myTableHeader',
      onCallback: () => {}
    })
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-header
          columns=columns
          hook=myHook
          onCallback=onCallback
        }}
      `)

      return wait()
    })

    it('should have a frost-table-cell per column', function () {
      expect(this.$('.frost-table-cell')).to.have.length(columns.length)
    })

    it('should display proper column labels', function () {
      const columnNames = $hook('myTableHeader-cell').toArray().map((el) => $(el).text().trim())
      expect(columnNames).to.eql(columns.map((col) => col.label))
    })

    describe('when columns updated to have custom cell renderers', function () {
      beforeEach(function () {
        const newColumns = [
          {
            className: 'name-col',
            label: 'Name',
            renderer: 'text-input-renderer',
            propertyName: 'name'
          },
          {
            className: 'real-name-col',
            label: 'Real Name',
            renderer: 'text-input-renderer',
            propertyName: 'realName'
          }
        ]

        this.set('columns', newColumns)

        return wait()
      })

      it('should not have any text-input-renderer components', function () {
        expect(this.$('.text-input-renderer')).to.have.length(0)
      })
    })

    describe('when one column updated to have custom header renderer', function () {
      beforeEach(function () {
        const newColumns = [
          {
            className: 'name-col',
            headerRenderer: 'text-input-renderer',
            label: 'Name',
            propertyName: 'name'
          },
          {
            className: 'real-name-col',
            label: 'Real Name',
            propertyName: 'realName'
          }
        ]

        this.set('columns', newColumns)

        return wait()
      })

      it('should have one text-input-renderer components', function () {
        expect(this.$('.text-input-renderer')).to.have.length(1)
      })
    })
  })
})
