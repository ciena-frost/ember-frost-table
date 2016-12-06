/**
 * Unit test for the extend helper
 */
import {expect} from 'chai'
import {beforeEach, describe, it} from 'mocha'

import {extend} from 'ember-frost-table/helpers/extend'

describe('Unit / Helper / extend', function () {
  let original, extended
  beforeEach(function () {
    original = {
      bar: 'baz',
      baz: 'foo',
      foo: 'bar'
    }
    extended = extend([original], {fizz: 'bang'})
  })

  it('should leave the original object alone', function () {
    expect(original).to.eql({
      bar: 'baz',
      baz: 'foo',
      foo: 'bar'
    })
  })

  it('should return the merged object', function () {
    expect(extended).to.eql({
      bar: 'baz',
      baz: 'foo',
      fizz: 'bang',
      foo: 'bar'
    })
  })
})
