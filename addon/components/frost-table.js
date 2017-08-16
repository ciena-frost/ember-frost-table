/* global $ */
/**
 * Component definition for the frost-table component
 */
import Ember from 'ember'
const {A, isNone} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ColumnPropType, ItemPropType, ItemsPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table'
import {select} from '../utils/selection'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['_isShiftDown:shift-down'],
  layout,
  tagName: 'table',

  // == PropTypes =============================================================

  propTypes: {
    // options
    columns: PropTypes.arrayOf(ColumnPropType).isRequired,
    itemKey: PropTypes.string,
    items: ItemsPropType.isRequired,
    selectedItems: PropTypes.arrayOf(ItemPropType),

    // callbacks
    onCallback: PropTypes.func,
    onSelectionChange: PropTypes.func,

    // state
    _isShiftDown: PropTypes.bool,
    _itemComparator: PropTypes.func,

    _rangeState: PropTypes.shape({
      anchor: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      endpoint: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ])
    })
  },

  getDefaultProps () {
    return {
      // options
      columns: [],
      items: [],
      onCallback () {},

      // state
      _rangeState: {
        anchor: null,
        endpoint: null
      }
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('columns')
  /**
   * Pre-computed indices
   * @param {Column[]} columns - the column data we want to present
   * @returns {Column[]} indexed - columns with an 'index' property added
   */
  indexedColumns (columns) {
    return columns.map((column, index) => Object.assign({index}, column))
  },

  @readOnly
  @computed()
  _isSelectable () {
    return !isNone(this.get('onSelectionChange'))
  },

  // == Functions =============================================================

  setShift (event) {
    if (!this.isDestroyed) {
      this.set('_isShiftDown', event.shiftKey)
    }
  },

  setCellWidths (position) {
    const cellRowSelector = this.$('.has-categories').length === 1 ? '.frost-table-header-columns' : ''
    const curBodyColumn = this.$(`.frost-table-row .frost-table-body-cell:nth-child(${position})`)
    const curHeaderCell = this.$(`.frost-table-header ${cellRowSelector} .frost-table-cell:nth-child(${position})`)

    const bodyCellFlexBasis = parseFloat(curBodyColumn.css('flex-basis'))
    const headerCellWidth = curHeaderCell.outerWidth(true)

    if (isNaN(bodyCellFlexBasis) || headerCellWidth > bodyCellFlexBasis) {
      curHeaderCell.css('flex-basis', `${headerCellWidth}px`)
      curBodyColumn.css('flex-basis', `${headerCellWidth}px`)
      return headerCellWidth
    } else {
      curHeaderCell.css('flex-basis', `${bodyCellFlexBasis}px`)
      curBodyColumn.css('flex-basis', `${bodyCellFlexBasis}px`)
      return bodyCellFlexBasis
    }
  },

  accountForSelectionColumn (num) {
    if (this.get('_isSelectable')) {
      return num + 1
    }
    return num
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  init () {
    this._super(...arguments)
    this._keyHandler = this.setShift.bind(this)
    $(document).on(`keyup.${this.elementId} keydown.${this.elementId}`, this._keyHandler)
  },

  willDestroyElement () {
    this._super(...arguments)
    $(document).off(`keyup.${this.elementId} keydown.${this.elementId}`, this._keyHandler)
  },

  didInsertElement () {
    this._super(...arguments)
    const selectable = this.get('_isSelectable')
    let totalWidth = 0
    if (selectable) {
      // Selection column does not need to grow
      this.$('.frost-table-header-selection-cell').css({
        'flex-grow': 0,
        'flex-shrink': 0
      })
      this.$('.frost-table-row-selection').css({
        'flex-grow': 0,
        'flex-shrink': 0
      })
      totalWidth += this.setCellWidths(1)
    }
    this.columns.forEach((column, index) => {
      const position = this.accountForSelectionColumn(index + 1)
      totalWidth += this.setCellWidths(position)
    })

    this.$().css('min-width', `${totalWidth}px`)
  },

  // == Actions ===============================================================

  actions: {
    /**
     * Wrap our arguments in a single object, so that cell renderers can trigger arbitrary events.
     * Your handler is then responsible for doing stuff based on actions like 'click' or 'input'.
     *
     * @param {Number} row - data rows are zero based, and header has row -1
     * @param {Number} col - column index
     * @param {String} action - this comes after row/col as Ember lets us include those in action closures easily.
     * @param {Object[]} args - any additional data
     */
    handleCallback (row, col, action, args) {
      const handler = this.get('onCallback')
      if (handler) {
        handler({action, row, col, args})
      }
    },

    _select ({isRangeSelect, isSpecificSelect, item}) {
      const items = this.get('items')
      const itemKey = this.get('itemKey')
      const clonedSelectedItems = A(this.get('selectedItems').slice())
      const _rangeState = this.get('_rangeState')

      select(isRangeSelect, isSpecificSelect, item, itemKey, items, clonedSelectedItems, _rangeState)

      this.onSelectionChange(clonedSelectedItems)
    }
  }
})
