/**
 * Component definition for the frost-table-header component
 */
import Ember from 'ember'
const {A, isEmpty} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-header'
import {ColumnPropType} from 'ember-frost-table/typedefs'

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
    const {_categoryColumns, _categoryRowClass, _columnRowClass, isSelectable, rowTagName} =
      this.getProperties('rowTagName', 'isSelectable', '_categoryColumns', '_categoryRowClass', '_columnRowClass')

    // Wrap category and regular header columns into separate rows
    const lastCategoryIndex = _categoryColumns.length + (isSelectable ? 1 : 0)
    this.$('.frost-table-header-cell').slice(0, lastCategoryIndex)
      .wrapAll(`<${rowTagName} class='${_categoryRowClass} frost-table-row frost-table-header-row'></${rowTagName}>`)
    this.$('.frost-table-header-cell').slice(lastCategoryIndex)
      .wrapAll(`<${rowTagName} class='${_columnRowClass} frost-table-row frost-table-header-row'></${rowTagName}>`)
  },

  alignCategories () {
    const cellTag = this.get('cellTagName')
    const selectable = this.get('isSelectable')
    const categoryColumns = this.get('_categoryColumns')
    const categoryRowClass = this.get('_categoryRowClass')
    const columnRowClass = this.get('_columnRowClass')
    const categorySelector = `.${categoryRowClass} .frost-table-cell`
    const columnSelector = `.${columnRowClass} .frost-table-cell`

    if (cellTag === 'th' || cellTag === 'td') {
      // Make use of colspan property
      categoryColumns.forEach((category, index) => {
        if (selectable) {
          ++index
        }
        this.$(categorySelector).eq(index).attr('colspan', category.span)
      })
    } else {
      // Need to determine and set width
      let startColumn = selectable ? 1 : 0
      categoryColumns.forEach((category, index) => {
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
