/**
 * Component definition for the frost-table component
 */
import Ember from 'ember'
const {run} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table'
import {ColumnPropType} from 'ember-frost-table/typedefs'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'table',

  // == PropTypes =============================================================

  propTypes: {
    // required
    columns: PropTypes.arrayOf(ColumnPropType).isRequired,
    items: PropTypes.array.isRequired,

    // options
    onCallback: PropTypes.func

    // state
  },

  getDefaultProps () {
    return {
      // options
      columns: [],
      items: [],
      onCallback () {}

      // state
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
    run.schedule('afterRender', this, function () {
      const that = this
      this.columns.forEach(function (column, index) {
        const curBodyColumn = that.$().find('.frost-table-row .frost-table-body-cell:nth-child(' + (index + 1) + ')')
        const curHeaderCell = that.$().find('.frost-table-header-cell:nth-child(' + (index + 1) + ')')

        const bodyCellWidth = curBodyColumn.innerWidth()
        const headerCellWidth = curHeaderCell.innerWidth()

        let basis = bodyCellWidth > headerCellWidth ? bodyCellWidth : headerCellWidth

        curHeaderCell.css('flex-basis', basis + 'px')
        curBodyColumn.css('flex-basis', basis + 'px')
      })
    })
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
