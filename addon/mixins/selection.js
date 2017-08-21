/* global $ */
/**
 * Mixin for providing common selection functionality to table components
 */
import Ember from 'ember'
const {A, Mixin, isNone} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {ItemPropType} from 'ember-frost-table/typedefs'
import {PropTypes} from 'ember-prop-types'

export default Mixin.create({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['isShiftDown:shift-down'],

  // == PropTypes =============================================================

  propTypes: {
    selectedItems: PropTypes.arrayOf(ItemPropType),
    itemKey: PropTypes.string,
    onSelectionChange: PropTypes.func,
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

  /**
   * @returns {Object} the default properties for this mixin
   */
  getDefaultProps () {
    return {
      _rangeState: {
        anchor: null,
        endpoint: null
      }
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed()
  isSelectable () {
    return !isNone(this.get('onSelectionChange'))
  },

  // == Functions =============================================================

  select (isRangeSelect, isSpecificSelect, item, itemKey, allItems, selectedItems, rangeState) {
    // Selects are proccessed in order of precedence: specific, range, basic
    if (isSpecificSelect) {
      this.specific(selectedItems, item, rangeState, itemKey)
    } else if (isRangeSelect) {
      this.range(allItems, selectedItems, item, rangeState, itemKey)
    } else {
      this.basic(selectedItems, item, rangeState, itemKey)
    }
  },

  /**
   * Basic selection acts conditionally based on the presence of additional selections.
   *
   * If no other selections are present the selection simply toggles the given item's selection state.
   *
   * If other selections are present the selection clears the other selections, but positively selects
   * the given item.
   *
   * @param {Object[]} selectedItems - currently selected items
   * @param {Object} item - selection event target
   * @param {Object} rangeState - tracking the anchor and endpoint
   * @param {String} itemKey - comma delimited key used to compare items
   */
  basic (selectedItems, item, rangeState, itemKey) {
    // If a previous set of selections is present
    const index = selectedItems.findIndex(selectedItem => this.itemComparator(itemKey, selectedItem, item))
    if (selectedItems.get('length') > 1 || index === -1) {
      // Clear the other selections and select the item
      selectedItems.setObjects([item])

      // Set the range anchor
      rangeState['anchor'] = item

      // New anchor, clear any previous endpoint
      rangeState['endpoint'] = null
    } else {
      // Toggle the item selection
      const isCurrentlySelected = index >= 0
      const isSelected = !isCurrentlySelected
      if (isSelected) {
        selectedItems.addObject(item)
      } else {
        selectedItems.removeAt(index)
      }

      // Set the range anchor if selected, otherwise clear the anchor
      rangeState['anchor'] = isSelected ? item : null

      // New or no anchor, clear any previous endpoint
      rangeState['endpoint'] = null
    }
  },

  /**
   * Range selection requires an anchor and an endpoint; items between the
   * anchor and endpoint are added to the selected items (inclusive).
   * This means that a range selection event is either setting an anchor
   * or selecting items between the anchor and a new endpoint
   *
   * @param {Object[]} items - all items available
   * @param {Object[]} selectedItems - currently selected items
   * @param {Object} item - selection event target
   * @param {Object} rangeState - tracking the anchor and endpoint
   * @param {String} itemKey - comma delimited key used to compare items
   */
  /* eslint-disable complexity */
  range (items, selectedItems, item, rangeState, itemKey) {
    // If an anchor isn't set or in the current list of items, then set the anchor and exit
    const rangeAnchor = rangeState['anchor']
    const anchor = rangeAnchor ? items.findIndex(currentItem =>
      this.itemComparator(itemKey, currentItem, rangeAnchor)) : -1
    if (anchor === -1) {
      // Range select is always a positive selection (no deselect)
      rangeState['anchor'] = item

      // New anchor, clear any previous endpoint
      rangeState['endpoint'] = null

      // Add the anchor to the selected items
      selectedItems.addObject(item)

      return
    }
    // Find the indices of the endpoint
    const endpoint = items.findIndex(currentItem => this.itemComparator(itemKey, currentItem, item))

    // Select all of the items between the anchor and the item (inclusive)
    if (anchor < endpoint) {
      selectedItems.addObjects(items.slice(anchor, endpoint + 1))
    } else {
      selectedItems.addObjects(items.slice(endpoint, anchor + 1))
    }

    // If an endpoint was already selected remove selected items that were
    // in the previous range but aren't in the new range
    const previousEndpoint = items.findIndex(currentItem =>
      this.itemComparator(itemKey, currentItem, rangeState['endpoint']))
    if (previousEndpoint >= 0) {
      // If both endpoints are above the anchor
      if (anchor < endpoint && anchor < previousEndpoint) {
        // and the new range includes fewer items
        if (previousEndpoint > endpoint) {
          selectedItems.removeObjects(items.slice(endpoint + 1, previousEndpoint + 1))
        }
      // If both endpoints are below the anchor
      } else if (endpoint < anchor && previousEndpoint < anchor) {
        // and the new range includes fewer items
        if (previousEndpoint < endpoint) {
          selectedItems.removeObjects(items.slice(previousEndpoint, endpoint))
        }
      // Pivoted over the anchor, deselect all items in the previous range minus the anchor
      } else if (anchor > previousEndpoint) {
        selectedItems.removeObjects(items.slice(previousEndpoint, anchor))
      } else {
        selectedItems.removeObjects(items.slice(anchor + 1, previousEndpoint + 1))
      }
    }

    // If items in the list are compared using itemKey rather than by reference
    // then addObject(s) won't guarentee uniqueness, so do a uniqueness pass
    if (itemKey) {
      selectedItems.setObjects(selectedItems.uniqBy(itemKey))
    }

    // Store the new endpoint
    rangeState['endpoint'] = item
  },
  /* eslint-enable complexity */

  /**
   * Specific selection toggles the current selection state for a given
   * item without impacting the selection state for any other items
   *
   * @param {Object[]} selectedItems - currently selected items
   * @param {Object} item - selection event target
   * @param {Object} rangeState - tracking the anchor and endpoint
   * @param {String} itemKey - comma delimited key used to compare items
   */
  specific (selectedItems, item, rangeState, itemKey) {
    const index = selectedItems.findIndex(selectedItem => this.itemComparator(itemKey, selectedItem, item))
    const isCurrentlySelected = (index >= 0)
    const isSelected = !isCurrentlySelected

    // Set the range anchor if selected, otherwise clear the anchor
    rangeState['anchor'] = isSelected ? item : null
    // New or no anchor, clear any previous endpoint
    rangeState['endpoint'] = null

    // Store the selection
    if (isSelected) {
      selectedItems.addObject(item)
    } else {
      selectedItems.removeAt(index)
    }
  },

  /**
   * Used to compare items based on provided key to determine which items should
   * be in the selected state
   * @param {String} itemKey - comma delimited key used to compare items
   * @param {Object} lhs - First item to compare
   * @param {Object} rhs - Second item to compare
   * @returns {Boolean} true if lhs and rhs are equivalent in their itemKey properties, false otherwise
   */
  itemComparator (itemKey, lhs, rhs) {
    if (itemKey) {
      const keys = itemKey.split(',')
      return isNone(lhs) || isNone(rhs) ? false : keys.reduce((val, key) => {
        key = key.trim()
        return val && (lhs[key] === rhs[key])
      }, true)
    }
    return false
  },

  /**
   * @param {Integer} num - index of the data column
   * @returns {String} the column number in the DOM, accounting for the added selection column
   */
  getColIndex (num) {
    if (this.get('isSelectable')) {
      return num + 1
    }
    return num
  },

  setShift (event) {
    if (!this.isDestroyed) {
      this.set('isShiftDown', event.shiftKey)
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

  // == Actions ===============================================================
  actions: {
    select ({isRangeSelect, isSpecificSelect, item}) {
      if (this.get('isSelectable')) {
        const items = this.get('items')
        const itemKey = this.get('itemKey')
        const clonedSelectedItems = A(this.get('selectedItems').slice())
        const _rangeState = this.get('_rangeState')

        this.select(isRangeSelect, isSpecificSelect, item, itemKey, items, clonedSelectedItems, _rangeState)

        this.onSelectionChange(clonedSelectedItems)
      }
    }
  }
})
