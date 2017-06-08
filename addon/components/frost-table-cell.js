/**
 * Component definition for the frost-table-cell component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-cell'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'td',

  // == PropTypes =============================================================

  propTypes: {
    cellRenderer: PropTypes.any,
    item: PropTypes.object,
    value: PropTypes.any,

    onCallback: PropTypes.func.isRequired
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
