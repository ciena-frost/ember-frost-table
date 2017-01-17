/**
 * Component definition for the frost-table-body component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-body'
import {ColumnPropType, ItemsPropType} from 'ember-frost-table/typedefs'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'tbody',

  // == PropTypes =============================================================

  propTypes: {
    // required
    onCallback: PropTypes.func.isRequired,

    // options
    columns: PropTypes.arrayOf(ColumnPropType),
    items: ItemsPropType

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
