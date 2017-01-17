/**
 * Unit test for the main export point of ember-frost-table
 */

import {expect} from 'chai'
import * as tableExports from 'ember-frost-table'
import {describe, it} from 'mocha'

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
