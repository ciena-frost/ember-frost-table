/**
 * Component definition for the frost-table-body-row component
 */

import Ember from 'ember'
const {ViewUtils, isEmpty} = Ember
const {isSimpleClick} = ViewUtils
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ColumnPropType, ItemPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import TableMixin from '../mixins/table'
import layout from '../templates/components/frost-table-row'

export default Component.extend(TableMixin, {
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
    isSelectable: PropTypes.bool,
    onSelect: PropTypes.func,

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
      item: {},
      isSelectable: false

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
    if (this.get('isSelectable')) {
      const isRangeSelect = event.shiftKey
      const isSpecificSelect = false

      // Only process simple clicks or clicks with the acceptable modifiers
      if (isSimpleClick(event) || isRangeSelect) {
        event.preventDefault()
        event.stopPropagation()

        this.onSelect({
          isRangeSelect,
          isSpecificSelect,
          item: this.get('item')
        })
      }
    }
  },

  // == Lifecycle Hooks =======================================================

  didRender () {
    this.$().css({
      'flex-grow': 1,
      'flex-shrink': 0,
      'flex-basis': `${this.setMinimumCellWidths('')}px`
    })
    this._super(...arguments)
  },

  // == Actions ===============================================================

  actions: {
  }
})
