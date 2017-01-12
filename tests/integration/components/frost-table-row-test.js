/**
 * Integration test for the frost-table-body-row component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$, get} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

import {columns, heroes} from './data'
import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-table-row')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    this.setProperties({
      columns,
      hero: heroes[2],
      myHook: 'myTableRow',
      onCallback: () => {}
    })
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-row
          columns=columns
          hook=myHook
          item=hero
          onCallback=onCallback
        }}
      `)

      return wait()
    })

    it('should have a frost-table-cell per column', function () {
      expect(this.$('.frost-table-cell')).to.have.length(columns.length)
    })

    it('should display proper cell data', function () {
      const cellData = $hook('myTableRow-cell').toArray().map((el) => $(el).text().trim())

      const expected = []
      columns.forEach((col) => {
        expected.push(get(heroes[2], col.propertyName))
      })

      expect(cellData).to.eql(expected)
    })

    describe('when columns updated to have custom header renderers', function () {
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
            headerRenderer: 'text-input-renderer',
            label: 'Real Name',
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

    describe('when one column updated to have custom cell renderer', function () {
      beforeEach(function () {
        const newColumns = [
          {
            className: 'name-col',
            label: 'Name',
            propertyName: 'name',
            renderer: 'text-input-renderer'
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
