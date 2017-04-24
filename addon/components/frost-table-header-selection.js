/**
 * Component definition for the frost-table-header-selection component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-header-selection'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options

    // state
  },

  getDefaultProps () {
    return {
      // options
      onDeselectAll: PropTypes.func.isRequired

      // state
    }
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  click (event) {
    this.onDeselectAll()
  }

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
