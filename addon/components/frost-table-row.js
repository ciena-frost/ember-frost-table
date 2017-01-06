/**
 * Component definition for the frost-table-body-row component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import {ColumnPropType} from 'ember-frost-table/typedefs'
import layout from '../templates/components/frost-table-row'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'tr',

  // == PropTypes =============================================================

  propTypes: {
    // options
    callbackDispatch: PropTypes.func,
    cellCss: PropTypes.string,
    cellTagName: PropTypes.string,
    columns: PropTypes.arrayOf(ColumnPropType),
    item: PropTypes.object

    // state
  },

  getDefaultProps () {
    return {
      // options
      cellTagName: 'td',
      cellCss: this.get('css'),
      columns: [],
      item: {}

      // state
    }
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
    handleCallback (...args) {
      if (this.get('callbackDispatch')) {
        this.get('callbackDispatch')(...args)
      }
    }
  }
})
