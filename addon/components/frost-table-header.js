/**
 * Component definition for the frost-table-header component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import {ColumnPropType} from 'ember-frost-table/typedefs'
import layout from '../templates/components/frost-table-header'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'thead',

  // == PropTypes =============================================================

  propTypes: {
    // options
    cellCss: PropTypes.string,
    cellTagName: PropTypes.string,
    columns: PropTypes.arrayOf(ColumnPropType)

    // state
  },

  getDefaultProps () {
    return {
      // options
      cellCss: this.get('css'),
      cellTagName: 'th',
      columns: []

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
