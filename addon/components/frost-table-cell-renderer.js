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
    colIndex: PropTypes.number,

    // required
    item: PropTypes.object.isRequired,
    onCallback: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
    /**
     * Default handler for input events
     * @param {Event} e - the input event from a child component's input event
     */
    handleInput (e) {
      const onCallback = this.get('onCallback')
      onCallback('input', e.target.value)
    }
  }
})
