/**
 * Component definition for the frost-table component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import {ColumnPropType} from 'ember-frost-table/typedefs'
import layout from '../templates/components/frost-table'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'table',

  // == PropTypes =============================================================

  propTypes: {
    // options
    columns: PropTypes.arrayOf(ColumnPropType),
    items: PropTypes.array

    // state
  },

  getDefaultProps () {
    return {
      // options
      columns: [],
      items: []

      // state
    }
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
