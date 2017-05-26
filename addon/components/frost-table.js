/**
 * Component definition for the frost-table component
 */

import Ember from 'ember'
const {A, get, isNone} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table'
import selection from '../utils/selection'
import {ColumnPropType} from 'ember-frost-table/typedefs'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['_isShiftDown:shift-down'],
  layout,
  tagName: 'table',

  // == PropTypes =============================================================

  propTypes: {
    // required
    columns: PropTypes.arrayOf(ColumnPropType).isRequired,
    items: PropTypes.array.isRequired,

    // options
    itemKey: PropTypes.string,
    selectedItems: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ])),
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

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  init () {
    this._super(...arguments)
    const itemKey = this.get('itemKey')
    if (itemKey) {
      this.set('_itemComparator', function (lhs, rhs) {
        return isNone(lhs) || isNone(rhs) ? false : get(lhs, itemKey) === get(rhs, itemKey)
      })
    }
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
      const _itemComparator = this.get('_itemComparator')
      const clonedSelectedItems = A(this.get('selectedItems').slice())
      const _rangeState = this.get('_rangeState')

      // Selects are proccessed in order of precedence: specific, range, basic
      if (isSpecificSelect) {
        selection.specific(clonedSelectedItems, item, _rangeState, _itemComparator)
      } else if (isRangeSelect) {
        selection.range(items, clonedSelectedItems, item, _rangeState, _itemComparator, itemKey)
      } else {
        selection.basic(clonedSelectedItems, item, _rangeState, _itemComparator)
      }
      this.onSelectionChange(clonedSelectedItems)
    }
  }
})
