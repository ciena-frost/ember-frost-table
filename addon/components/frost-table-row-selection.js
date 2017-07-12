/**
 * The selection control for frost list items - indicates state and captures clicks
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-row-selection'
import {click} from '../utils/selection'
import {ItemPropType} from 'ember-frost-table/typedefs'

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
    click(event, this.onSelect, this.get('item'))
  }

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
