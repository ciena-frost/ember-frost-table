/**
 * Component definition for the frost-table-cell component
 */

import {Component} from 'ember-frost-core'
import layout from '../templates/components/frost-table-cell'
import {ItemPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'td',

  // == PropTypes =============================================================

  propTypes: {
    // options
    cellRenderer: PropTypes.any,
    item: ItemPropType,
    value: PropTypes.any,

    // callbacks
    onCallback: PropTypes.func.isRequired

    // state
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
