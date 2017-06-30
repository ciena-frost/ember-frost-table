/**
 * Component definition for the frost-table-body-row component
 */

import Ember from 'ember'
const {isEmpty} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-row'
import {ColumnPropType, ItemPropType} from 'ember-frost-table/typedefs'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['_isItemSelected:is-selected', 'isSelectable:selectable'],
  layout,
  tagName: 'tr',

  // == PropTypes =============================================================

  propTypes: {
    // options
    cellCss: PropTypes.string,
    cellTagName: PropTypes.string,
    columns: PropTypes.arrayOf(ColumnPropType),
    item: ItemPropType,

    // callbacks
    onCallback: PropTypes.func.isRequired

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

  @readOnly
  @computed('selectedItems.[]')
  _isItemSelected (selectedItems) {
    if (isEmpty(selectedItems)) {
      return false
    }
    return selectedItems.includes(this.get('item'))
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  click (event) {
    event.stopPropagation()
    this.$().find('.frost-table-row-selection').trigger('click')
  },

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
