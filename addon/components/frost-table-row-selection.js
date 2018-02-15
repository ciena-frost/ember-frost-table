/**
 * The selection control for frost list items - indicates state and captures clicks
 */

import Ember from 'ember'
const {ViewUtils} = Ember
const {isSimpleClick} = ViewUtils

import {Component} from 'ember-frost-core'
import layout from '../templates/components/frost-table-row-selection'
import {ItemPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'
import UAParser from 'ua-parser-js'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options
    item: ItemPropType.isRequired,
    itemKey: PropTypes.string.isRequired,

    // callbacks
    onSelect: PropTypes.func.isRequired

    // state
  },

  getDefaultProps () {
    return {
    }
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================

  click (event) {
    // Acceptable event modifiers
    // When the checkbox is the target a simple click is equivalent to a specific select
    const isSpecificSelect = isSimpleClick(event) ||
      ((new UAParser()).getOS() === 'Mac OS' ? event.ctrlKey : event.metaKey) // TODO Move instance to a service
    const isRangeSelect = event.shiftKey

    // Only process simple clicks or clicks with the acceptable modifiers
    if (isSpecificSelect || isRangeSelect) {
      event.preventDefault()
      event.stopPropagation()

      this.onSelect({
        isRangeSelect,
        isSpecificSelect,
        item: this.get('item')
      })
    }
  }

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
