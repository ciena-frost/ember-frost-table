/**
 * Component definition for the frost-table component
 */

import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ItemsPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import SelectionMixin from '../mixins/selection'
import TableMixin from '../mixins/table'
import layout from '../templates/components/frost-table'

export default Component.extend(SelectionMixin, TableMixin, {
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'table',

  // == PropTypes =============================================================

  propTypes: {
    // options
    items: ItemsPropType.isRequired,

    // callbacks
    onCallback: PropTypes.func
  },

  getDefaultProps () {
    return {
      // options
      items: [],
      onCallback () {}
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

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didInsertElement () {
    this._super(...arguments)
    this.$().css('min-width', `${this.alignColumns('.frost-table-header', '.frost-table-body')}px`)
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
    }
  }
})
