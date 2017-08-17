/**
 * Component definition for the frost-fixed-table component
 */
import Ember from 'ember'
const {$, A, isNone} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ColumnPropType, ItemPropType, ItemsPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-fixed-table'
import {select} from '../utils/selection'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['_isShiftDown:shift-down'],
  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options:
    columns: PropTypes.arrayOf(ColumnPropType).isRequired,
    items: ItemsPropType.isRequired,
    itemKey: PropTypes.string,
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
      // do nothing by default, as the grid may not have any custom renderers that would need to emit events
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
  @computed('css')
  /**
   * The selector for the left body DOM element (specifically the scroll wrapper)
   * @param {String} css - the base css class name for the component
   * @returns {String} a suitable jQuery selector for the left section of the table body
   */
  _bodyLeftSelector (css) {
    return `.${css}-left .frost-scroll`
  },

  @readOnly
  @computed('css')
  /**
   * The selector for the middle body DOM element (specifically the scroll wrapper)
   * @param {String} css - the base css class name for the component
   * @returns {String} a suitable jQuery selector for the middle section of the table body
   */
  _bodyMiddleSelector (css) {
    return `.${css}-middle .frost-scroll`
  },

  @readOnly
  @computed('css')
  /**
   * The selector for the right body DOM element (specifically the scroll wrapper)
   * @param {String} css - the base css class name for the component
   * @returns {String} a suitable jQuery selector for the right section of the table body
   */
  _bodyRightSelector (css) {
    return `.${css}-right .frost-scroll`
  },

  @readOnly
  @computed('css')
  /**
   * The selector for the left header DOM element
   * @param {String} css - the base css class name for the component
   * @returns {String} a suitable jQuery selector for the left section of the table header
   */
  _headerLeftSelector (css) {
    return `.${css}-header-left`
  },

  @readOnly
  @computed('css')
  /**
   * The selector for the middle header DOM element (specifically the scroll wrapper)
   * @param {String} css - the base css class name for the component
   * @returns {String} a suitable jQuery selector for the middle section of the table header
   */
  _headerMiddleSelector (css) {
    return `.${css}-header-middle .frost-scroll`
  },

  @readOnly
  @computed('css')
  /**
   * The selector for the right header DOM element
   * @param {String} css - the base css class name for the component
   * @returns {String} a suitable jQuery selector for the right section of the table header
   */
  _headerRightSelector (css) {
    return `.${css}-header-right`
  },

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
  @computed('columns')
  /**
   * Pre-computed indices
   * @param {Column[]} columns - the column data we want to present
   * @returns {Boolean} true if the table will have categories, false otherwise
   */
  haveCategories (columns) {
    return columns.reduce((cur, column) => { return cur || !isNone(column.category) }, false)
  },

  @readOnly
  @computed('indexedColumns', 'haveCategories')
  /**
   * Get the set of columns that are supposed to be frozen on the left
   *
   * The set of leftColumns is defined as all the columns with `frozen` === `true`
   * starting with the first column until we reach one w/o `frozen` === `true`
   *
   * @param {Column[]} columns - all the columns
   * @param {Boolean} haveCategories - if the header has categories
   * @returns {Column[]} just the left-most frozen columns
   */
  leftColumns (columns, haveCategories) {
    const frozenColumns = []
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (column.frozen) {
        if (haveCategories && isNone(column.category)) {
          column.category = ''
        }
        frozenColumns.push(column)
      } else {
        return frozenColumns
      }
    }

    return frozenColumns
  },

  @readOnly
  @computed('indexedColumns', 'haveCategories')
  /**
   * Get the set of columns that are supposed to be in the middle (between the frozen left and frozen right columns)
   *
   * The set of middleColumns is defined as all the columns with `frozen` === `false`
   * starting with whatever the first column is with `frozen` === `false` until we reach one with `frozen` === `true`
   *
   * @param {Column[]} columns - all the columns
   * @param {Boolean} haveCategories - if the header has categories
   * @returns {Column[]} just the middle columns
   */
  middleColumns (columns, haveCategories) {
    const unFrozenColumns = []
    let foundUnFrozen = false
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (column.frozen) {
        if (foundUnFrozen) {
          return unFrozenColumns
        }
      } else {
        if (haveCategories && isNone(column.category)) {
          column.category = ''
        }
        foundUnFrozen = true
        unFrozenColumns.push(column)
      }
    }

    return unFrozenColumns
  },

  @readOnly
  @computed('indexedColumns', 'haveCategories')
  /**
   * Get the set of columns that are supposed to be frozen on the right
   *
   * The set of rightColumns is defined as all the columns with `frozen` === `true`
   * starting with the first `frozen` === `true` column after we've seen at least one `frozen` === `false` column.
   *
   * @param {Column[]} columns - all the columns
   * @param {Boolean} haveCategories - if the header has categories
   * @returns {Column[]} just the middle columns
   */
  rightColumns (columns, haveCategories) {
    const frozenColumns = []
    for (let i = columns.length - 1; i > 0; i--) {
      const column = columns[i]
      if (column.frozen) {
        if (haveCategories && isNone(column.category)) {
          column.category = ''
        }
        frozenColumns.push(column)
      } else {
        return frozenColumns.reverse()
      }
    }

    return frozenColumns.reverse()
  },

  @readOnly
  @computed()
  _isSelectable () {
    return !isNone(this.get('onSelectionChange'))
  },

  // == Functions =============================================================

  _categoryRowSelector (sectionSelector) {
    return this.$(`${sectionSelector} .frost-table-header-columns`).length === 1
      ? '.frost-table-header-columns' : ''
  },

  /**
   * Make the three body sections (left, middle, right) the correct height to stay within the bounds of the
   * table itself
   */
  setupBodyHeights () {
    const headerMiddleSelector = this.get('_headerMiddleSelector')
    const headerHeight = this.$(headerMiddleSelector).outerHeight()
    const tableHeight = this.$().outerHeight()
    const bodyHeight = tableHeight - headerHeight

    const bodyLeftSelector = this.get('_bodyLeftSelector')
    const bodyMiddleSelector = this.get('_bodyMiddleSelector')
    const bodyRightSelector = this.get('_bodyRightSelector')

    ;[bodyLeftSelector, bodyMiddleSelector, bodyRightSelector].forEach((selector) => {
      this.$(selector).css({height: `${bodyHeight}px`})
    })

    // Empty rows still need height set so border shows when row is selected
    const rowHeight = this.$('.frost-table-row:not(:empty) .frost-table-row-cell').outerHeight()
    this.$('.frost-table-row:empty').css({height: `${rowHeight}px`})
  },

  /**
   * frost-scroll seems to display scroll bars on hover, sooo, we need to proxy hover events to the place where
   * the scrollbar is present, the middle body when the middle of the header is hovered, and the right body when
   * the left or middle body is hovered.
   */
  setupHoverProxy () {
    const hoverClass = 'ps-container-hover'
    const bodyLeftSelector = this.get('_bodyLeftSelector')
    const bodyMiddleSelector = this.get('_bodyMiddleSelector')
    const bodyRightSelector = this.get('_bodyRightSelector')

    ;[bodyLeftSelector, bodyMiddleSelector].forEach((selector) => {
      const $element = this.$(selector)
      $element.on('mouseenter', () => {
        this.$(bodyRightSelector).addClass(hoverClass)
      })
      $element.on('mouseleave', () => {
        this.$(bodyRightSelector).removeClass(hoverClass)
      })
    })

    const headerMiddleSelector = this.get('_headerMiddleSelector')
    const $headerMiddle = this.$(headerMiddleSelector)
    $headerMiddle.on('mouseenter', () => {
      this.$(bodyMiddleSelector).addClass(hoverClass)
    })

    $headerMiddle.on('mouseleave', () => {
      this.$(bodyMiddleSelector).removeClass(hoverClass)
    })
  },

  setupLeftWidths () {
    this.setMinimumCellWidths(this.get('_bodyLeftSelector'), this.get('leftColumns').length, true)
    const leftWidth = this.alignColumns(this.get('_headerLeftSelector'), this.get('_bodyLeftSelector'))
    this.$(`${this.get('_headerLeftSelector')}`).css('flex', `1 0 ${leftWidth}px`)
    this.$(`${this.get('_bodyLeftSelector')}`).parent().css('flex', `1 0 ${leftWidth}px`)
  },

  setupMiddleWidths () {
    this.setMinimumCellWidths(this.get('_bodyMiddleSelector'), this.get('middleColumns').length, false)
    const middleWidth = this.alignColumns(this.get('_headerMiddleSelector'), this.get('_bodyMiddleSelector'))
    this.$(`${this.get('_headerMiddleSelector')}`).parent().css('flex', `1 1 ${middleWidth}px`)
    this.$(`${this.get('_bodyMiddleSelector')}`).parent().css('flex', `1 1 ${middleWidth}px`)
    this.$(`${this.get('_bodyMiddleSelector')} .frost-table-row`).css('min-width', `${middleWidth}px`)
  },

  setupRightWidths () {
    this.setMinimumCellWidths(this.get('_bodyRightSelector'), this.get('rightColumns').length, false)
    const rightWidth = this.alignColumns(this.get('_headerRightSelector'), this.get('_bodyRightSelector'))
    this.$(`${this.get('_headerRightSelector')}`).css('flex', `1 0 ${rightWidth}px`)
    this.$(`${this.get('_bodyRightSelector')}`).parent().css('flex', `1 0 ${rightWidth}px`)
  },

  /**
   * Set up the scroll synchronization between the different components within the table that should scroll together
   */
  setupScrollSync () {
    const headerMiddleSelector = this.get('_headerMiddleSelector')
    const bodyLeftSelector = this.get('_bodyLeftSelector')
    const bodyMiddleSelector = this.get('_bodyMiddleSelector')
    const bodyRightSelector = this.get('_bodyRightSelector')

    this.syncScrollLeft(headerMiddleSelector, bodyMiddleSelector)
    this.syncScrollLeft(bodyMiddleSelector, headerMiddleSelector)

    this.syncScrollTop(bodyLeftSelector, bodyMiddleSelector, bodyRightSelector)
    this.syncScrollTop(bodyMiddleSelector, bodyLeftSelector, bodyRightSelector)
    this.syncScrollTop(bodyRightSelector, bodyLeftSelector, bodyMiddleSelector)
  },

  /**
   * Sync horizontal scrolling between a source of scroll events and a set of destination selectors
   * @param {String} source - the selector of the source of the scroll events
   * @param {String[]} destinations - the selectors of the destination (the ones being driven by the source)
   */
  syncScrollLeft (source, ...destinations) {
    this.$(source).on('scroll', () => {
      // NOTE: intentionally not putting this in the ember run loop because doing so made it much less responsive
      // there was a noticible lag between scrolling and re-positioning the synced element. Plus it's not updating
      // any DOM content, just setting scroll positions.
      const $source = this.$(source)
      destinations.forEach((destination) => {
        const $destination = this.$(destination)
        $destination.scrollLeft($source.scrollLeft())
      })
    })
  },

  /**
   * Sync vertical scrolling between a source of scroll events and a set of destination selectors
   * @param {String} source - the selector of the source of the scroll events
   * @param {String[]} destinations - the selectors of the destination (the ones being driven by the source)
   */
  syncScrollTop (source, ...destinations) {
    this.$(source).on('scroll', () => {
      // NOTE: intentionally not putting this in the ember run loop because doing so made it much less responsive
      // there was a noticible lag between scrolling and re-positioning the synced element. Plus it's not updating
      // any DOM content, just setting scroll positions.
      const $source = this.$(source)
      destinations.forEach((destination) => {
        const $destination = this.$(destination)
        $destination.scrollTop($source.scrollTop())
      })
    })
  },

  alignColumns (headerSelecter, bodySelector) {
    const cellRowSelector = this._categoryRowSelector(headerSelecter)
    const headerCells = this.$(`${headerSelecter} ${cellRowSelector} .frost-table-header-cell`)
    let totalWidth = 0
    for (let pos = 0; pos < headerCells.length; ++pos) {
      const curBodyColumn = this.$(`${bodySelector} .frost-table-row .frost-table-row-cell:nth-child(${pos + 1})`)
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

  setShift (event) {
    if (!this.isDestroyed) {
      this.set('_isShiftDown', event.shiftKey)
    }
  },

  setMinimumCellWidths (bodySelector, numColumns, accountForSelection) {
    for (let pos = 1; pos <= numColumns; ++pos) {
      const curBodyColumn = this.$(`${bodySelector} .frost-table-row .frost-table-row-cell:nth-child(` +
        `${accountForSelection ? this.accountForSelectionColumn(pos) : pos})`)

      // Get width of widest body cell in the column
      const cellWidths = curBodyColumn.toArray().map((col) => {
        return this.$(col).outerWidth(true)
      })
      const width = Math.max.apply(null, cellWidths)

      curBodyColumn.css('flex', `1 0 ${width}px`)
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

  willDestroy () {
    $(document).off(`keyup.${this.elementId} keydown.${this.elementId}`, this._keyHandler)
  },

  /**
   * Set up synced scrolling as well as calculating padding for middle sections
   */
  didRender () {
    this._super(...arguments)
    this.setupBodyHeights()
    this.setupHoverProxy()
    this.setupScrollSync()
  },

  didInsertElement () {
    // Only should do these operations on first insertion
    this._super(...arguments)

    // Selection column does not need to grow
    const selectable = this.get('_isSelectable')
    if (selectable) {
      this.$('.frost-table-header-selection-cell').css({
        'flex-grow': 0,
        'flex-shrink': 0
      })
      this.$('.frost-table-row-selection').css({
        'flex-grow': 0,
        'flex-shrink': 0
      })
    }

    this.setupLeftWidths()
    this.setupMiddleWidths()
    this.setupRightWidths()
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
     * @param {Object} args - any additional data (e.g. an array or object)
     */
    handleCallback (row, col, action, args) {
      this.onCallback({action, args, col, row})
    },

    _clickRow (row, event) {
      const leftSectionRow = this.$(`${this.get('_bodyLeftSelector')} .frost-table-row`).eq(row)
      event.target = leftSectionRow[0]
      leftSectionRow.trigger(event)
    },

    _select ({isRangeSelect, isSpecificSelect, item}) {
      if (this.get('_isSelectable')) {
        const items = this.get('items')
        const itemKey = this.get('itemKey')
        const clonedSelectedItems = A(this.get('selectedItems').slice())
        const _rangeState = this.get('_rangeState')

        select(isRangeSelect, isSpecificSelect, item, itemKey, items, clonedSelectedItems, _rangeState)

        this.onSelectionChange(clonedSelectedItems)
      }
    }
  }
})
