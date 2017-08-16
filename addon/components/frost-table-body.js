/**
 * Component definition for the frost-table-body component
 */

import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {ColumnPropType, ItemsPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-body'

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,
  tagName: 'tbody',

  // == PropTypes =============================================================

  propTypes: {

    // options
    columns: PropTypes.arrayOf(ColumnPropType),
    items: ItemsPropType,

    // callbacks
    onCallback: PropTypes.func.isRequired

    // state
  },

  getDefaultProps () {
    return {
      // options
      columns: [],
      items: []

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('itemKey')
  _eachItemKey (itemKey) {
    return itemKey || '@index'
  },

  // == Functions =============================================================

  setCellWidths (position) {
    const curBodyColumn = this.$(`.frost-table-row .frost-table-body-cell:nth-child(${position})`)

    // Get width of widest body cell in the column
    const cellWidths = curBodyColumn.toArray().map((col) => {
      return this.$(col).outerWidth(true)
    })
    const width = Math.max.apply(null, cellWidths)

    curBodyColumn.css('flex', `1 0 ${width}px`)

    return width
  },

  accountForSelectionColumn (num) {
    if (this.get('isSelectable')) {
      return num + 1
    }
    return num
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  didInsertElement () {
    this._super(...arguments)
    let totalWidth = 0
    this.columns.forEach((column, index) => {
      const position = this.accountForSelectionColumn(index + 1)
      totalWidth += this.setCellWidths(position)
    })

    this.$().css('flex', `1 0 ${totalWidth}px`)
  },

  // == Actions ===============================================================

  actions: {
  }
})
