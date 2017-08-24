/**
 * Mixin for providing common functionality to table components
 */
import Ember from 'ember'
const {Mixin, isNone} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {ColumnPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

export const ROW_SELECTION_CLASS = 'frost-table-row-selection'
export const HEADER_SELECTION_CLASS = 'frost-table-header-selection-cell'
export const HEADER_CATEGORIES_CLASS = 'frost-table-header-categories'
export const HEADER_COLUMNS_CLASS = 'frost-table-header-columns'

export default Mixin.create({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  // == PropTypes =============================================================

  propTypes: {
    columns: PropTypes.arrayOf(ColumnPropType).isRequired
  },

  /**
   * @returns {Object} the default properties for this mixin
   */
  getDefaultProps () {
    return {
      columns: []
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('columns')
  /**
   * Pre-computed indices
   * @param {Column[]} columns - the column data we want to present
   * @returns {Boolean} true if the table will have categories, false otherwise
   */
  haveCategories (columns) {
    return columns.some(function (column) {
      return !isNone(column.category)
    })
  },

  @readOnly
  @computed('haveCategories')
  /**
   * Pre-computed indices
   * @param {Boolean} haveCategories - whether the table header has categories or not
   * @returns {String} jQuery selector string for getting the header column row
   */
  headerColumnsSelector (haveCategories) {
    return haveCategories ? '.frost-table-header-columns' : ''
  },

  @readOnly
  @computed('haveCategories')
  /**
   * Pre-computed indices
   * @param {Boolean} haveCategories - whether the table header has categories or not
   * @returns {String} jQuery selector string for getting the header column cells
   */
  headerColumnCellSelector (haveCategories) {
    return `${this.get('headerColumnsSelector')} .frost-table-header-cell`.trim()
  },

  // == Functions =============================================================

  /**
   * @param {String} rowSelector - JQuery selector matching a single row
   */
  setMinimumCellWidths (rowSelector = '') {
    const numColumns = this.$(`${rowSelector}`).eq(0).children('.frost-table-cell').length
    for (let pos = 1; pos <= numColumns; ++pos) {
      const curBodyColumn = this.$(`${rowSelector} .frost-table-cell:nth-child(${pos})`)
      const width = curBodyColumn.outerWidth(true)
      curBodyColumn.css({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': `${width}px`
      })
    }
  },

  /**
   * @param {String} headerSelector - JQuery selector matching the header
   * @param {String} bodySelector - JQuery selector matching the body
   * @returns {Integer} - the total width of all columns
   */
  alignHeaderAndBody (headerSelector, bodySelector) {
    return this.alignColumns(
      `${headerSelector} ${this.get('headerColumnsSelector')}, ${bodySelector} .frost-table-row`
    )
  },

  /**
   * @param {String} selector - JQuery selector matching all the rows
   * @returns {Integer} - the total width of all columns
   */
  alignColumns (selector) {
    const numColumns = this.$(selector).eq(0).children().length
    let totalWidth = 0
    for (let pos = 1; pos <= numColumns; ++pos) {
      totalWidth += this.alignColumn(this.$(selector).children(`:nth-child(${pos})`))
    }
    return totalWidth
  },

  /**
   * @param {String} selector - JQuery object matching all cells in a given column
   * @returns {Integer} - the column's width
   */
  alignColumn (selector) {
    /*
     * At this point expect the flex-basis property has been set for all cells
     * corresponding to the minimum width of the cell
     */
    const cellWidths = selector.toArray().map((col) => {
      return parseFloat(this.$(col).css('flex-basis'))
    })
    const sharedBasis = Math.max(...cellWidths)
    selector.css('flex-basis', `${sharedBasis}px`)
    return sharedBasis
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================
  actions: {
  }
})
