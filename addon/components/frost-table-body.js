/**
 * Component definition for the frost-table-body component
 */

import Ember from 'ember'
const {Component} = Ember
import PropTypesMixin, {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-table-body'

export default Component.extend(PropTypesMixin, {
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNameBindings: ['css'],
  layout,
  tagName: 'tbody',

  // == PropTypes =============================================================

  /**
   * Properties for this component. Options are expected to be (potentially)
   * passed in to the component. State properties are *not* expected to be
   * passed in/overwritten.
   */
  propTypes: {
    // options
    columns: PropTypes.arrayOf(PropTypes.shape({
      className: PropTypes.string,
      label: PropTypes.string,
      propertyName: PropTypes.string.isRequired
    })),
    css: PropTypes.string,
    hook: PropTypes.string.isRequired,
    items: PropTypes.array,

    // state

    // keywords
    layout: PropTypes.any
  },

  /** @returns {Object} the default property values when not provided by consumer */
  getDefaultProps () {
    return {
      // options
      columns: [],
      css: this.getCss(),
      items: []

      // state
    }
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  /**
   * @returns {String} the base css class for this component (the component name)
   */
  getCss () {
    return this.toString().replace(/^.+:(.+)::.+$/, '$1')
  },

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

  actions: {
  }
})
