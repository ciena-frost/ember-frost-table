/**
 * Integration test for the frost-table-cell component
 */

import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const test = integration('frost-table-cell')
describe(test.label, function () {
  test.setup()

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    this.setProperties({
      myHook: 'myThing',
      value: 'my value',
      handleCallback () {}
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('after render with value', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-cell
          hook=myHook
          value=value

          onCallback=handleCallback
        }}
      `)

      return wait()
    })

    it('should have an element with the proper className', function () {
      expect(this.$('.frost-table-cell')).to.have.length(1)
    })

    it('should be accessible via the hook', function () {
      expect($hook('myThing')).to.have.length(1)
    })

    it('should render the given value', function () {
      expect($hook('myThing').text().trim()).to.equal('my value')
    })
  })

  describe('after render with custom renderer', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-table-cell
          cellRenderer=(component 'text-input-renderer')
          hook=myHook
          value=value

          onCallback=handleCallback
        }}
      `)

      return wait()
    })

    it('should have an element with the proper className wrapping the custom renderer', function () {
      expect(this.$('.frost-table-cell .text-input-renderer')).to.have.length(1)
    })

    it('should be accessible via the hook', function () {
      expect($hook('myThing')).to.have.length(1)
    })

    it('should render the given value', function () {
      expect($hook('myThing-renderer-text-input').val()).to.equal('my value')
    })
  })
})
