/**
 * Type definitions for ember-frost-table
 */

import {PropTypes} from 'ember-prop-types'

/**
 * @typedef Column
 * @property {String} [className] - the name of the class to add to all cells of a column
 * @property {Component} [headerRenderer] - the cell renderer to use for the header of this column
 * @property {Number} [index] - the column index of this column. Added by the table components.
 * @property {String} label - the column header label
 * @property {String} propertyName - the name of the property in the data record to display in this column
 * @property {Boolean} [frozen=false] - true if this column should be frozen (on either the left or right side of the table)
 * @property {Component} [renderer] - the cell renderer to use for all data cells in this column
 * @property {String} [category] - the category the column belongs to
 * @property {String} [categoryClassName] - the css class name of the category the column belongs to
 * @property {Component} [headerCategoryRenderer] - the cell renderer to use to the category column in the header
 */

export const ColumnPropType = PropTypes.shape({
  className: PropTypes.string,
  frozen: PropTypes.bool,
  headerRenderer: PropTypes.any,
  index: PropTypes.number,
  label: PropTypes.string,
  propertyName: PropTypes.string.isRequired,
  renderer: PropTypes.any,
  category: PropTypes.any,
  categoryClassName: PropTypes.string,
  headerCategoryRenderer: PropTypes.any
})

export const ItemPropType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.EmberObject
])

export const ItemsPropType = PropTypes.oneOfType([
  PropTypes.EmberObject, // DS.RecordArray
  PropTypes.arrayOf(ItemPropType)
])
