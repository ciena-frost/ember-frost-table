/**
 * Unit test for the main export point of ember-frost-table
 */

import {expect} from 'chai'
import {describe, it} from 'mocha'
import * as tableExports from 'ember-frost-table'

describe('index', function () {
  const components = [
    'FixedTable',
    'Body',
    'Cell',
    'CellRenderer',
    'Header',
    'Row',
    'Table'
  ]

  components.forEach((component) => {
    it(`should include the ${component} component`, function () {
      expect(tableExports[component]).not.to.equal(undefined)
    })
  })
})
