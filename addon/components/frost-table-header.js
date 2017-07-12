/**
 * Component definition for the frost-table-header component
 */
import Ember from 'ember'
const {A} = Ember
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
    let hasCategories = false
    columns.forEach((column) => {
      if (column.category) {
        hasCategories = true
        return
      }
    })
    return hasCategories
  },

  @readOnly
  @computed('columns')
  _categoryColumns (columns) {
    let categoryColumns = A([])
    let index = 0
    columns.forEach((column) => {
      let lastCategoryColumn = categoryColumns.get('lastObject')
      const categoryLabel = column.category ? column.category : ''
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
    })
    return categoryColumns
  },

  // == Functions =============================================================

  setupRows () {
    const rowTag = this.get('rowTagName')
    const selectable = this.get('isSelectable')
    const categoryColumns = this.get('_categoryColumns')
    const categoryRowClass = this.get('_categoryRowClass')
    const columnRowClass = this.get('_columnRowClass')

    // Wrap category and regular header columns into separate rows
    const lastCategoryIndex = categoryColumns.length + (selectable ? 1 : 0)
    this.$('.frost-table-header-cell').slice(0, lastCategoryIndex)
      .wrapAll(`<${rowTag} class='${categoryRowClass} frost-table-row frost-table-header-row'></${rowTag}>`)
    this.$('.frost-table-header-cell').slice(lastCategoryIndex)
      .wrapAll(`<${rowTag} class='${columnRowClass} frost-table-row frost-table-header-row'></${rowTag}>`)
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
