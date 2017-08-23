/**
 * Component definition for the frost-table-body component
 */

import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ItemsPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import TableMixin from '../mixins/table'
import layout from '../templates/components/frost-table-body'

export default Component.extend(TableMixin, {
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'tbody',

  // == PropTypes =============================================================

  propTypes: {

    // options
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

  didRender () {
    this.$().css('flex', `1 0 ${this.setMinimumCellWidths('.frost-table-row')}px`)
    this._super(...arguments)
  },

  // == Actions ===============================================================

  actions: {
  }
})
