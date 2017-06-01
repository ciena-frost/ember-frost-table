/**
 * Component definition for the frost-table-body-row component
 */

import Ember from 'ember'
const {isEmpty} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-row'
import {ColumnPropType} from 'ember-frost-table/typedefs'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['_isItemSelected:is-selected'],
  layout,
  tagName: 'tr',

  // == PropTypes =============================================================

  propTypes: {
    // options
    onCallback: PropTypes.func.isRequired,
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

  @readOnly
  @computed('selectedItems.[]')
  _isItemSelected (selectedItems) {
    if (isEmpty(selectedItems)) {
      return false
    }

    const item = this.get('item')
    const itemComparator = this.get('itemComparator')
    return selectedItems.some(selectedItem => itemComparator(item, selectedItem))
  },

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
