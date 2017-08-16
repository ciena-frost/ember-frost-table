/**
 * Component definition for the frost-table-header component
 */
import Ember from 'ember'
const {A, isNone, run} = Ember
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
      return !isNone(column.category)
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
    }, A(this.get('isSelectable') ? [{
      index: index++,
      label: '',
      span: 1
    }] : []))
  },

  // == Functions =============================================================

  setupRows () {
    const {_categoryColumns, _categoryRowClass, _columnRowClass, rowTagName} =
      this.getProperties('rowTagName', '_categoryColumns', '_categoryRowClass', '_columnRowClass')

    // Wrap category and regular header columns into separate rows
    const lastCategoryIndex = _categoryColumns.length
    this.$('.frost-table-header-cell').slice(0, lastCategoryIndex)
      .wrapAll(`<${rowTagName} class='${_categoryRowClass} frost-table-row frost-table-header-row'></${rowTagName}>`)
    this.$('.frost-table-header-cell').slice(lastCategoryIndex)
      .wrapAll(`<${rowTagName} class='${_columnRowClass} frost-table-row frost-table-header-row'></${rowTagName}>`)
  },

  alignColumns () {
    const rowClass = this.get('_hasCategories') ? `.${this.get('_columnRowClass')}` : ''
    const columnSelector = `${rowClass} .frost-table-cell`

    this.$(columnSelector).toArray().forEach((el) => {
      const flexBasis = this.parseFloatOrDefault(this.$(el).css('flex-basis'), this.$(el).outerWidth(true))
      this.$(el).css('flex', `1 0 ${flexBasis}px`)
    })
  },

  alignCategories () {
    const {_categoryColumns, _categoryRowClass, _columnRowClass} =
      this.getProperties('_categoryColumns', '_categoryRowClass', '_columnRowClass')
    const categorySelector = `.${_categoryRowClass} .frost-table-cell`
    const columnSelector = `.${_columnRowClass} .frost-table-cell`

    let startColumn = 0
    _categoryColumns.forEach((category, index) => {
      let categoryFlexBasis = 0
      let categoryFlexGrow = 0
      let categoryFlexShrink = 0
      this.$(columnSelector).slice(startColumn, startColumn + category.span).toArray().forEach((el) => {
        const flexBasis = parseFloat(this.$(el).css('flex-basis'))
        const flexGrow = parseFloat(this.$(el).css('flex-grow'))
        const flexShrink = parseFloat(this.$(el).css('flex-shrink'))

        categoryFlexBasis += flexBasis
        categoryFlexGrow += flexGrow
        categoryFlexShrink += flexShrink
      })
      this.$(categorySelector).eq(index).css({
        'flex': `${categoryFlexGrow} ${categoryFlexShrink} ${categoryFlexBasis}px`
      })
      startColumn += category.span
    })
  },

  parseFloatOrDefault (string, defaultVal) {
    const float = parseFloat(string)
    if (!isNaN(float)) {
      return float
    }
    return defaultVal
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didInsertElement () {
    this._super(...arguments)
    if (this.get('_hasCategories')) {
      this.setupRows()
      run.next(this, () => {
        this.alignCategories()
      })
    }
    this.alignColumns()
  },

  // == Actions ===============================================================

  actions: {
  }
})
