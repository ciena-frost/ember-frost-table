/**
 * Component definition for the frost-table-body component
 */

import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ColumnPropType, ItemsPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-body'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'tbody',

  // == PropTypes =============================================================

  propTypes: {

    // options
    columns: PropTypes.arrayOf(ColumnPropType),
    items: ItemsPropType,

    // callbacks
    onCallback: PropTypes.func.isRequired

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

  @readOnly
  @computed('itemKey')
  _eachItemKey (itemKey) {
    return itemKey || '@index'
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
