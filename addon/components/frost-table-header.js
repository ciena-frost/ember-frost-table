/**
 * Component definition for the frost-table-header component
 */
import Ember from 'ember'
const {A, isEmpty} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ColumnPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-header'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['_hasCategories:has-categories'],
  layout,
  tagName: 'thead',

  // == PropTypes =============================================================

  propTypes: {
    // options
    cellTagName: PropTypes.string,
    rowTagName: PropTypes.string,
    columns: PropTypes.arrayOf(ColumnPropType),

    // callbacks
    onCallback: PropTypes.func.isRequired

    // state
  },

  getDefaultProps () {
    return {
      // options
      cellTagName: 'th',
      rowTagName: 'tr',
      columns: []

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('css')
  _categoryRowClass (css) {
    return `${css}-categories`
  },

  @readOnly
  @computed('css')
  _columnRowClass (css) {
    return `${css}-columns`
  },

  @readOnly
  @computed('columns')
  _hasCategories (columns) {
    return columns.some(function (column) {
      return !isEmpty(column.category)
    })
  },

  @readOnly
  @computed('columns')
  _categoryColumns (columns) {
    let index = 0
    return columns.reduce((categoryColumns, column) => {
      const lastCategoryColumn = categoryColumns.get('lastObject')
      const categoryLabel = column.category || ''
      if (lastCategoryColumn && lastCategoryColumn.label === categoryLabel) {
        lastCategoryColumn.span += 1
      } else {
        categoryColumns.addObject({
          index: index++,
          label: categoryLabel,
          span: 1,
          className: column.categoryClassName,
          renderer: column.headerCategoryRenderer
        })
      }
      return categoryColumns
    }, A())
  },

  // == Functions =============================================================

  setupRows () {
    const {_categoryColumns, _categoryRowClass, _columnRowClass, rowTagName} =
      this.getProperties('rowTagName', '_categoryColumns', '_categoryRowClass', '_columnRowClass')

    // Wrap category and regular header columns into separate rows
    const lastCategoryIndex = this.accountForSelectionColumn(_categoryColumns.length)
    this.$('.frost-table-header-cell').slice(0, lastCategoryIndex)
      .wrapAll(`<${rowTagName} class='${_categoryRowClass} frost-table-row frost-table-header-row'></${rowTagName}>`)
    this.$('.frost-table-header-cell').slice(lastCategoryIndex)
      .wrapAll(`<${rowTagName} class='${_columnRowClass} frost-table-row frost-table-header-row'></${rowTagName}>`)
  },

  alignCategories () {
    const {_categoryColumns, _categoryRowClass, _columnRowClass, cellTagName} =
      this.getProperties('cellTagName', '_categoryColumns', '_categoryRowClass', '_columnRowClass')
    const categorySelector = `.${_categoryRowClass} .frost-table-cell`
    const columnSelector = `.${_columnRowClass} .frost-table-cell`

    if (cellTagName === 'th' || cellTagName === 'td') {
      // Make use of colspan property
      _categoryColumns.forEach((category, index) => {
        index = this.accountForSelectionColumn(index)
        this.$(categorySelector).eq(index).attr('colspan', category.span)
      })
    } else {
      // Need to determine and set width
      let startColumn = this.accountForSelectionColumn(0)
      _categoryColumns.forEach((category, index) => {
        let totalWidth = 0
        this.$(columnSelector).slice(startColumn, startColumn + category.span).toArray().forEach((el) => {
          totalWidth += this.$(el).outerWidth()
        })
        this.$(categorySelector).eq(index).css({
          'width': `${totalWidth}px`
        })
        startColumn += category.span
      })
    }
  },

  accountForSelectionColumn (num) {
    if (this.get('isSelectable')) {
      return num + 1
    }
    return num
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didRender () {
    if (this.get('_hasCategories')) {
      this.setupRows()
      this.alignCategories()
    }
  },

  // == Actions ===============================================================

  actions: {
  }
})
