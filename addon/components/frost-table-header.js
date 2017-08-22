/**
 * Component definition for the frost-table-header component
 */
import Ember from 'ember'
const {A, run} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import TableMixin, {HEADER_CATEGORIES_CLASS, HEADER_COLUMNS_CLASS} from '../mixins/table'
import layout from '../templates/components/frost-table-header'

export default Component.extend(TableMixin, {
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['haveCategories:has-categories'],
  layout,
  tagName: 'thead',

  // == PropTypes =============================================================

  propTypes: {
    // options
    cellTagName: PropTypes.string,
    rowTagName: PropTypes.string,
    isSelectable: PropTypes.bool,

    // callbacks
    onCallback: PropTypes.func.isRequired

    // state
  },

  getDefaultProps () {
    return {
      // options
      cellTagName: 'th',
      rowTagName: 'tr',
      isSelectable: false

      // state
    }
  },

  // == Computed Properties ===================================================

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
    const {_categoryColumns, rowTagName} = this.getProperties('rowTagName', '_categoryColumns')

    // Wrap category and regular header columns into separate rows
    const lastCategoryIndex = _categoryColumns.length
    this.$('.frost-table-header-cell').slice(0, lastCategoryIndex).wrapAll(
      `<${rowTagName} class='${HEADER_CATEGORIES_CLASS} frost-table-row frost-table-header-row'></${rowTagName}>`)
    this.$('.frost-table-header-cell').slice(lastCategoryIndex).wrapAll(
      `<${rowTagName} class='${HEADER_COLUMNS_CLASS} frost-table-row frost-table-header-row'></${rowTagName}>`)
  },

  alignCategories () {
    const _categoryColumns = this.get('_categoryColumns')
    const categorySelector = `.${HEADER_CATEGORIES_CLASS} .frost-table-cell`
    const columnSelector = `.${HEADER_COLUMNS_CLASS} .frost-table-cell`

    let startColumn = 0
    _categoryColumns.forEach((category, index) => {
      let categoryFlexBasis = 0
      let categoryFlexGrow = 0
      let categoryFlexShrink = 0
      this.$(columnSelector).slice(startColumn, startColumn + category.span).toArray().forEach((el) => {
        const col = this.$(el)
        const flexBasis = parseFloat(col.css('flex-basis'))
        const flexGrow = parseFloat(col.css('flex-grow'))
        const flexShrink = parseFloat(col.css('flex-shrink'))

        categoryFlexBasis += flexBasis
        categoryFlexGrow += flexGrow
        categoryFlexShrink += flexShrink
      })
      this.$(categorySelector).eq(index).css({
        'flex-grow': categoryFlexGrow,
        'flex-shrink': categoryFlexShrink,
        'flex-basis': `${categoryFlexBasis}px`
      })
      startColumn += category.span
    })
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didRender () {
    this._super(...arguments)
    if (this.get('haveCategories')) {
      this.setupRows()
      run.next(this, () => {
        this.alignCategories()
      })
    }
    this.setMinimumCellWidths(this.get('headerColumnsSelector'))
  },

  // == Actions ===============================================================

  actions: {
  }
})
