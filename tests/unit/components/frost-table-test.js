/**
 * Unit test for the frost-table component
 *
 * NOTE: Since it is not easy to properly set up an integration test to confirm some of the DOM
 * calculations happening in frost-table, I opted to unit test these calculations, making these
 * tests a little more tied to the implementation than I'd like. However, given the hoops needed to jump through to
 * simulate external CSS as well as scroll and mouse events, this seemed the better option (@job13er 2016-12-13)
 */

import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {beforeEach, describe, it} from 'mocha'

const test = unit('frost-table')
describe(test.label, function () {
  test.setup()

  let component

  beforeEach(function () {
    component = this.subject({tagName: 'div'})
  })

  describe('onCallback', function () {
    let onCallback
    beforeEach(function () {
      onCallback = component.get('onCallback')
    })

    it('should default to a function', function () {
      expect(onCallback()).to.equal(undefined)
    })
  })
})
