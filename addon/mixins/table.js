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
   * @returns {String} jQuery selector string for getting the header column cells
   */
  headerColumnSelector (haveCategories) {
    return `${haveCategories ? '.frost-table-header-columns ' : ''}.frost-table-header-cell`
  },

  // == Functions =============================================================

  setMinimumCellWidths (bodySelector) {
    let totalWidth = 0
    const numColumns = this.$(`${bodySelector} .frost-table-row`).eq(0).children('.frost-table-cell').length
    for (let pos = 1; pos <= numColumns; ++pos) {
      const curBodyColumn = this.$(`${bodySelector} .frost-table-row .frost-table-cell:nth-child(${pos})`)

      // Get width of widest body cell in the column
      const cellWidths = curBodyColumn.toArray().map((col) => {
        return this.$(col).outerWidth(true)
      })
      const width = Math.max(...cellWidths)
      totalWidth += width
      curBodyColumn.css({
        'flex-grow': 1,
        'flex-shrink': 0,
        'flex-basis': `${width}px`
      })
    }
    return totalWidth
  },

  alignColumns (headerSelecter, bodySelector) {
    const headerCells = this.$(`${headerSelecter} ${this.get('headerColumnSelector')}`)
    let totalWidth = 0
    for (let pos = 0; pos < headerCells.length; ++pos) {
      const curBodyColumn = this.$(`${bodySelector} .frost-table-row .frost-table-cell:nth-child(${pos + 1})`)
      const curHeaderCell = headerCells.eq(pos)

      const bodyCellFlexBasis = parseFloat(curBodyColumn.css('flex-basis'))
      const headerCellWidth = curHeaderCell.outerWidth(true)

      if (isNaN(bodyCellFlexBasis) || headerCellWidth > bodyCellFlexBasis) {
        curHeaderCell.css('flex-basis', `${headerCellWidth}px`)
        curBodyColumn.css('flex-basis', `${headerCellWidth}px`)
        totalWidth += headerCellWidth
      } else {
        curHeaderCell.css('flex-basis', `${bodyCellFlexBasis}px`)
        curBodyColumn.css('flex-basis', `${bodyCellFlexBasis}px`)
        totalWidth += bodyCellFlexBasis
      }
    }
    return totalWidth
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didInsertElement () {
    this._super(...arguments)
    // Selection column does not need to grow
    if (this.get('isSelectable')) {
      this.$(`.${HEADER_SELECTION_CLASS}`).css({
        'flex-grow': 0,
        'flex-shrink': 0
      })
      this.$(`.${ROW_SELECTION_CLASS}`).css({
        'flex-grow': 0,
        'flex-shrink': 0
      })
    }
  },

  // == Actions ===============================================================
  actions: {
  }
})
