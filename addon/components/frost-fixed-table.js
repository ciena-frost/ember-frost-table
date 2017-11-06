/**
 * Component definition for the frost-fixed-table component
 */
import Ember from 'ember'
const {isNone} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import SelectionMixin from '../mixins/selection'
import TableMixin from '../mixins/table'
import layout from '../templates/components/frost-fixed-table'
import {ItemsPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

export default Component.extend(SelectionMixin, TableMixin, {
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options:
    items: ItemsPropType.isRequired,

    // callbacks
    onCallback: PropTypes.func
  },

  getDefaultProps () {
    return {
      // options
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

  // == Functions =============================================================

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
    const leftWidth = this.alignHeaderAndBody(
      `${this.get('_headerLeftSelector')} .frost-table-header`,
      this.get('_bodyLeftSelector')
    )
    this.$(`${this.get('_headerLeftSelector')}`).css({
      'flex-grow': 1,
      'flex-shrink': 0,
      'flex-basis': `${leftWidth}px`
    })
    this.$(`${this.get('_bodyLeftSelector')}`).parent().css({
      'flex-grow': 1,
      'flex-shrink': 0,
      'flex-basis': `${leftWidth}px`
    })
  },

  setupMiddleWidths () {
    const middleWidth = this.alignHeaderAndBody(
      `${this.get('_headerMiddleSelector')} .frost-table-header`,
      this.get('_bodyMiddleSelector')
    )
    this.$(`${this.get('_headerMiddleSelector')}`).parent().css({
      'flex-grow': 1,
      'flex-shrink': 1,
      'flex-basis': `${middleWidth}px`
    })
    this.$(`${this.get('_bodyMiddleSelector')}`).parent().css({
      'flex-grow': 1,
      'flex-shrink': 1,
      'flex-basis': `${middleWidth}px`
    })
    this.$(`${this.get('_bodyMiddleSelector')} .frost-table-row`).css('min-width', `${middleWidth}px`)
  },

  setupRightWidths () {
    const rightWidth = this.alignHeaderAndBody(
      `${this.get('_headerRightSelector')} .frost-table-header`,
      this.get('_bodyRightSelector')
    )
    this.$(`${this.get('_headerRightSelector')}`).css({
      'flex-grow': 1,
      'flex-shrink': 0,
      'flex-basis': `${rightWidth}px`
    })
    this.$(`${this.get('_bodyRightSelector')}`).parent().css({
      'flex-grow': 1,
      'flex-shrink': 0,
      'flex-basis': `${rightWidth}px`
    })
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

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  /**
   * Set up synced scrolling as well as calculating padding for middle sections
   */
  didRender () {
    this.setupBodyHeights()
    this.setupHoverProxy()
    this.setupScrollSync()
    this.setupLeftWidths()
    this.setupMiddleWidths()
    this.setupRightWidths()
    this._super(...arguments)
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
    }
  }
})
