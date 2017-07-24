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
  @computed('indexedColumns')
  /**
   * Get the set of columns that are supposed to be frozen on the left
   *
   * The set of leftColumns is defined as all the columns with `frozen` === `true`
   * starting with the first column until we reach one w/o `frozen` === `true`
   *
   * @param {Column[]} columns - all the columns
   * @returns {Column[]} just the left-most frozen columns
   */
  leftColumns (columns) {
    const frozenColumns = []
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (column.frozen) {
        frozenColumns.push(column)
      } else {
        return frozenColumns
      }
    }

    return frozenColumns
  },

  @readOnly
  @computed('indexedColumns')
  /**
   * Get the set of columns that are supposed to be in the middle (between the frozen left and frozen right columns)
   *
   * The set of middleColumns is defined as all the columns with `frozen` === `false`
   * starting with whatever the first column is with `frozen` === `false` until we reach one with `frozen` === `true`
   *
   * @param {Column[]} columns - all the columns
   * @returns {Column[]} just the middle columns
   */
  middleColumns (columns) {
    const unFrozenColumns = []
    let foundUnFrozen = false
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (column.frozen) {
        if (foundUnFrozen) {
          return unFrozenColumns
        }
      } else {
        foundUnFrozen = true
        unFrozenColumns.push(column)
      }
    }

    return unFrozenColumns
  },

  @readOnly
  @computed('indexedColumns')
  /**
   * Get the set of columns that are supposed to be frozen on the right
   *
   * The set of rightColumns is defined as all the columns with `frozen` === `true`
   * starting with the first `frozen` === `true` column after we've seen at least one `frozen` === `false` column.
   *
   * @param {Column[]} columns - all the columns
   * @returns {Column[]} just the middle columns
   */
  rightColumns (columns) {
    const frozenColumns = []
    for (let i = columns.length - 1; i > 0; i--) {
      const column = columns[i]
      if (column.frozen) {
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

  /**
   * Get the width of the middle section by adding up the widths of all the cells
   * @param {String} cellSelector - the selector to use to find the cells
   * @returns {Number} the combined outer width of all cells (in pixels)
   */
  _calculateWidth (cellSelector) {
    let width = 0

    this.$(cellSelector).toArray().forEach((el) => {
      width += $(el).outerWidth()
    })

    return width
  },

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

  /**
   * Calculate the widths of the left and right side and set the marings of the middle accordingly.
   */
  setupMiddleMargins () {
    const bodyLeftSelector = this.get('_bodyLeftSelector')
    const bodyRightSelector = this.get('_bodyRightSelector')

    const leftWidth = this.$(bodyLeftSelector).outerWidth()
    const rightWidth = this.$(bodyRightSelector).outerWidth()

    const headerMiddleSelector = this.get('_headerMiddleSelector')
    const bodyMiddleSelector = this.get('_bodyMiddleSelector')
    ;[headerMiddleSelector, bodyMiddleSelector].forEach((selector) => {
      this.$(selector).css({
        'margin-left': `${leftWidth}px`,
        'margin-right': `${rightWidth}px`
      })
    })
  },

  /**
   * Calculate how wide the middle sections should be by adding the sum of all the inner cells, then set that width
   */
  setupMiddleWidths () {
    const headerMiddleSelector = this.get('_headerMiddleSelector')
    const bodyMiddleSelector = this.get('_bodyMiddleSelector')
    const cellRowSelector = this._categoryRowSelector(headerMiddleSelector)

    const width = this._calculateWidth(`${headerMiddleSelector} ${cellRowSelector} .frost-table-cell`)
    const cssWidth = `${width}px`
    const cssProperties = {
      'width': cssWidth,
      'flex-basis': cssWidth
    }
    this.$(`${headerMiddleSelector} .frost-table-header`).css(cssProperties)
    this.$(`${bodyMiddleSelector} .frost-table-row`).css(cssProperties)

    this.alignColumns(headerMiddleSelector, bodyMiddleSelector)
  },

  setupLeftAndRightWidths () {
    this.alignColumns(this.get('_headerLeftSelector'), this.get('_bodyLeftSelector'))
    this.alignColumns(this.get('_headerRightSelector'), this.get('_bodyRightSelector'))
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
    for (let pos = 0; pos < headerCells.length; ++pos) {
      const curBodyColumn = this.$(`${bodySelector} .frost-table-row .frost-table-row-cell:nth-child(${pos + 1})`)
      const curHeaderCell = headerCells.eq(pos)
      const bodyCellWidth = curBodyColumn.outerWidth(true)
      const headerCellWidth = curHeaderCell.outerWidth(true)

      const width = bodyCellWidth > headerCellWidth ? bodyCellWidth : headerCellWidth

      const cssWidth = `${width}px`
      const cssProperties = {
        'width': cssWidth,
        'flex-basis': cssWidth
      }
      curHeaderCell.css(cssProperties)
      curBodyColumn.css(cssProperties)
    }
  },

  setShift (event) {
    if (!this.isDestroyed) {
      this.set('_isShiftDown', event.shiftKey)
    }
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
    this.setupLeftAndRightWidths() // Needs to happen before setting up middle section
    this.setupMiddleWidths()
    this.setupMiddleMargins()
    this.setupScrollSync()
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

    _clickRow (row) {
      this.$(`${this.get('_bodyLeftSelector')} .frost-table-row`).eq(row).trigger('click')
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
