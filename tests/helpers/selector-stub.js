/**
 * Test helper to stub a jQuery selector (something returned by this.$() within a component)
 * TODO: maybe move to ember-test-utils
 */

import sinon from 'sinon'

const defaultStubbedMethods = [
  'css',
  'find',
  'on',
  'scrollTop',
  'scrollLeft'
]

/**
 * @param {String[]} stubbedMethods - the names of methods to stub on this selector stub
 * @returns {*} a new selector stub
 */
export function createSelectorStub (...stubbedMethods) {
  const stub = {}
  if (stubbedMethods.length === 0) {
    stubbedMethods = defaultStubbedMethods
  }

  stubbedMethods.forEach((method) => {
    stub[method] = sinon.stub()
  })

  return stub
}
