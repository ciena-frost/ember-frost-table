/**
 * The extend helper, used to extend a given object by adding properites from another object to it
 * the original object is not modified, but rather the properties of all objects are copied onto a new, empty object
 */
import Ember from 'ember'
const {Helper, assign} = Ember
const {helper} = Helper

export function extend ([original], newProps) {
  return assign({}, original, newProps)
}

export default helper(extend)
