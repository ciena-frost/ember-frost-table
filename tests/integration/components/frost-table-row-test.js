/**
 * Integration test for the frost-table-body-row component
 */

import {expect} from 'chai'
import Ember from 'ember'
const {$, A, get} = Ember
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {columns, heroes} from './data'

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

  describe('after render with selection functionality', function () {
    let onSelectStub
    beforeEach(function () {
      let selectedItems = A([])
      let onSelect = function ({isRangeSelect, isSpecificSelect, item}) {
        selectedItems.pushObject(item)
      }
      onSelectStub = sinon.spy(onSelect)
      this.setProperties({
        selectedItems,
        isSelectable: true,
        onSelect: onSelectStub,
        itemKey: 'name'
      })
      this.render(hbs`
        {{frost-table-row
          columns=columns
          hook=myHook
          item=hero
          onCallback=onCallback
          isSelectable=isSelectable
          itemKey=itemKey
          onSelect=onSelect
          selectedItems=selectedItems
        }}
      `)

      return wait()
    })

    it('should have selectable class', function () {
      expect($hook('myTableRow')).to.have.class('selectable')
    })

    it('should have not have is-selected class', function () {
      expect($hook('myTableRow')).to.not.have.class('is-selected')
    })

    it('should have row selection cell', function () {
      expect($hook('myTableRow-selectionCell')).to.have.length(1)
    })

    describe('after clicking row', function () {
      beforeEach(function () {
        $hook('myTableRow').click()
        return wait()
      })

      it('should have have is-selected class', function () {
        expect($hook('myTableRow')).to.have.class('is-selected')
      })

      it('should have called onSelect method', function () {
        expect(onSelectStub).to.have.callCount(1)
      })
    })
  })

  describe('after render with custom row tag', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-row
          columns=columns
          hook=myHook
          item=hero
          tagName='div'
          onCallback=onCallback
        }}
      `)

      return wait()
    })

    it('should have rendered with correct class', function () {
      expect($hook('myTableRow')).to.have.class('frost-table-row')
    })

    it('should be of type div', function () {
      expect($hook('myTableRow').prop('tagName').toLowerCase()).to.eql('div')
    })

    it('should have not change cell tag name', function () {
      expect($hook('myTableRow-cell').prop('tagName').toLowerCase()).to.eql('td')
    })
  })
})
