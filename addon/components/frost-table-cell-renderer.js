/**
 * Component definition for the frost-table-cell-renderer component
 * This component can be used as a base-class for any cell renderer
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  // == PropTypes =============================================================

  propTypes: {
    // optional
    callbackDispatch: PropTypes.func,
    colIndex: PropTypes.number,

    // required
    item: PropTypes.object.isRequired,
    value: PropTypes.any.isRequired
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
    handleInput (e) {
      if (this.get('callbackDispatch')) {
        this.get('callbackDispatch')('input', e.target.value)
      }
    }
  }
})
