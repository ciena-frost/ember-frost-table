/**
 * Component definition for the frost-table component
 */

import Ember from 'ember'
const {Component} = Ember
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
import computed, {readOnly} from 'ember-computed-decorators'

import layout from '../templates/components/frost-table'

export default Component.extend(PropTypesMixin, {
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  classNames: ['frost-table'], // too bad we can't set this using this.getCss() too :(
  layout,

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

  @readOnly
  @computed('hook')
  /**
   * A pretty silly computed property just as an example of one
   * it appends '-' to the hook
   * @param {String} hook - the hook for this component
   * @returns {String} a hook prefix suitable for use within the template
   */
  hookPrefix (hook) {
    return `${hook}-`
  },

  // == Functions =============================================================

  /**
   * @returns {String} the base css class for this component
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
