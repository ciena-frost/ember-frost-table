/**
 * Unit test for the selection mixin
 */

import {expect} from 'chai'
import Ember from 'ember'
const {A} = Ember
import SelectionMixin from 'ember-frost-table/mixins/selection'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit / Mixins / selection', function () {
  let mixin, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    let Mixin = Ember.Object.extend(SelectionMixin, {
      columns: [],
      items: []
    })
    mixin = Mixin.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('Computed Properties', function () {
    describe('isSelectable', function () {
      describe('onSelectionChange handler is provided', function () {
        beforeEach(function () {
          mixin.setProperties({onSelectionChange: () => {}})
        })

        it('should be true', function () {
          expect(mixin.get('isSelectable')).to.equal(true)
        })
      })

      describe('onSelectionChange handler is provided', function () {
        it('should be false', function () {
          expect(mixin.get('isSelectable')).to.equal(false)
        })
      })
    })
  })

  describe('.select()', function () {
    beforeEach(function () {
      sandbox.stub(mixin, 'specific')
      sandbox.stub(mixin, 'range')
      sandbox.stub(mixin, 'basic')
    })

    describe('specific select', function () {
      beforeEach(function () {
        mixin.select(false, true)
      })

      it('should have called specific()', function () {
        expect(mixin.specific).to.have.callCount(1)
      })

      it('should not have called range()', function () {
        expect(mixin.range).to.have.callCount(0)
      })

      it('should not have called basic()', function () {
        expect(mixin.basic).to.have.callCount(0)
      })
    })

    describe('range select', function () {
      beforeEach(function () {
        mixin.select(true, false)
      })

      it('should not have called specific()', function () {
        expect(mixin.specific).to.have.callCount(0)
      })

      it('should have called range()', function () {
        expect(mixin.range).to.have.callCount(1)
      })

      it('should not have called basic()', function () {
        expect(mixin.basic).to.have.callCount(0)
      })
    })

    describe('basic select', function () {
      beforeEach(function () {
        mixin.select(false, false)
      })

      it('should not have called specific()', function () {
        expect(mixin.specific).to.have.callCount(0)
      })

      it('should not have called range()', function () {
        expect(mixin.range).to.have.callCount(0)
      })

      it('should have called basic()', function () {
        expect(mixin.basic).to.have.callCount(1)
      })
    })
  })

  describe('.basic()', function () {
    let selectedItems, item, rangeState, itemKey
    beforeEach(function () {
      item = {key1: 'foo', key2: 'bar'}
      rangeState = {
        anchor: null,
        endpoint: null
      }
      itemKey = 'key1'
    })

    describe('nothing selected yet', function () {
      beforeEach(function () {
        selectedItems = A([])
        mixin.basic(selectedItems, item, rangeState, itemKey)
      })

      it('should have added item to selectedItems', function () {
        expect(selectedItems, 'Wrong number of selected items').to.have.length(1)
        expect(selectedItems[0], 'Wrong selected item').to.eql(item)
      })

      it('should have set range state anchor', function () {
        expect(rangeState.anchor).to.eql(item)
      })

      it('should have cleared range state endpoint', function () {
        expect(rangeState.endpoint).to.eql(null)
      })
    })

    describe('item already selected', function () {
      describe('key values are not equal', function () {
        beforeEach(function () {
          selectedItems = A([{key1: 'qux', key2: 'bar'}])
          mixin.basic(selectedItems, item, rangeState, itemKey)
        })

        it('should have replaced item in selectedItems', function () {
          expect(selectedItems, 'Wrong number of selected items').to.have.length(1)
          expect(selectedItems[0], 'Wrong selected item').to.eql(item)
        })

        it('should have set range state anchor', function () {
          expect(rangeState.anchor).to.eql(item)
        })

        it('should have cleared range state endpoint', function () {
          expect(rangeState.endpoint).to.eql(null)
        })
      })

      describe('key values are equal', function () {
        beforeEach(function () {
          selectedItems = A([{key1: 'foo', key2: 'qux'}])
          mixin.basic(selectedItems, item, rangeState, itemKey)
        })

        it('should have removed item from selectedItems', function () {
          expect(selectedItems).to.have.length(0)
        })

        it('should have cleared range state anchor', function () {
          expect(rangeState.anchor).to.eql(null)
        })

        it('should have cleared range state endpoint', function () {
          expect(rangeState.endpoint).to.eql(null)
        })
      })
    })
  })

  describe('.specific()', function () {
    let selectedItems, item, rangeState, itemKey
    beforeEach(function () {
      item = {key1: 'foo', key2: 'bar'}
      rangeState = {
        anchor: null,
        endpoint: null
      }
      itemKey = 'key1'
    })

    describe('nothing selected yet', function () {
      beforeEach(function () {
        selectedItems = A([])
        mixin.specific(selectedItems, item, rangeState, itemKey)
      })

      it('should have added item to selectedItems', function () {
        expect(selectedItems, 'Wrong number of selected items').to.have.length(1)
        expect(selectedItems[0], 'Wrong selected item').to.eql(item)
      })

      it('should have set range state anchor', function () {
        expect(rangeState.anchor).to.eql(item)
      })

      it('should have cleared range state endpoint', function () {
        expect(rangeState.endpoint).to.eql(null)
      })
    })

    describe('item already selected', function () {
      describe('key values are not equal', function () {
        let item2 = {key1: 'qux', key2: 'bar'}
        beforeEach(function () {
          selectedItems = A([item2])
          mixin.specific(selectedItems, item, rangeState, itemKey)
        })

        it('should have appended item in selectedItems', function () {
          expect(selectedItems, 'Wrong number of selected items').to.have.length(2)
          expect(selectedItems[0], 'Wrong selected first item').to.eql(item2)
          expect(selectedItems[1], 'Wrong selected second item').to.eql(item)
        })

        it('should have set range state anchor', function () {
          expect(rangeState.anchor).to.eql(item)
        })

        it('should have cleared range state endpoint', function () {
          expect(rangeState.endpoint).to.eql(null)
        })
      })

      describe('key values are equal', function () {
        beforeEach(function () {
          selectedItems = A([{key1: 'foo', key2: 'qux'}])
          mixin.specific(selectedItems, item, rangeState, itemKey)
        })

        it('should have removed item from selectedItems', function () {
          expect(selectedItems).to.have.length(0)
        })

        it('should have cleared range state anchor', function () {
          expect(rangeState.anchor).to.eql(null)
        })

        it('should have cleared range state endpoint', function () {
          expect(rangeState.endpoint).to.eql(null)
        })
      })
    })
  })

  describe('.range()', function () {
    let selectedItems, item1, item2, item3, item4, item5, items, rangeState, itemKey
    beforeEach(function () {
      item1 = {key1: 'foo'}
      item2 = {key1: 'bar'}
      item3 = {key1: 'qux'}
      item4 = {key1: 'blah'}
      item5 = {key1: 'aux'}
      items = [item1, item2, item3, item4, item5]
      itemKey = 'key1'
    })

    describe('nothing selected yet', function () {
      beforeEach(function () {
        selectedItems = A([])
        rangeState = {
          anchor: null,
          endpoint: null
        }
        mixin.range(items, selectedItems, item3, rangeState, itemKey)
      })

      it('should have added item to selectedItems', function () {
        expect(selectedItems, 'Wrong number of selected items').to.have.length(1)
        expect(selectedItems[0], 'Wrong selected item').to.eql(item3)
      })

      it('should have set range state anchor', function () {
        expect(rangeState.anchor).to.eql(item3)
      })

      it('should have cleared range state endpoint', function () {
        expect(rangeState.endpoint).to.eql(null)
      })
    })

    describe('item already selected', function () {
      describe('key values are equal', function () {
        beforeEach(function () {
          selectedItems = A([item3])
          rangeState = {
            anchor: item3,
            endpoint: null
          }
          mixin.range(items, selectedItems, item3, rangeState, itemKey)
        })

        it('should have not changed selectedItems', function () {
          expect(selectedItems, 'Wrong number of selected items').to.have.length(1)
          expect(selectedItems[0], 'Wrong selected first item').to.eql(item3)
        })
      })

      describe('key values are not equal', function () {
        describe('select range above current anchor', function () {
          beforeEach(function () {
            selectedItems = A([item3])
            rangeState = {
              anchor: item3,
              endpoint: null
            }
            mixin.range(items, selectedItems, item1, rangeState, itemKey)
          })

          it('should have appended item in selectedItems', function () {
            expect(selectedItems, 'Wrong number of selected items').to.have.length(3)
            expect(selectedItems[0], 'Wrong selected first item').to.eql(item3)
            expect(selectedItems[1], 'Wrong selected second item').to.eql(item1)
            expect(selectedItems[2], 'Wrong selected third item').to.eql(item2)
          })

          it('should not have changed range state anchor', function () {
            expect(rangeState.anchor).to.eql(item3)
          })

          it('should have set range state endpoint', function () {
            expect(rangeState.endpoint).to.eql(item1)
          })
        })

        describe('select range below current anchor', function () {
          beforeEach(function () {
            selectedItems = A([item3])
            rangeState = {
              anchor: item3,
              endpoint: null
            }
            mixin.range(items, selectedItems, item5, rangeState, itemKey)
          })

          it('should have appended item in selectedItems', function () {
            expect(selectedItems, 'Wrong number of selected items').to.have.length(3)
            expect(selectedItems[0], 'Wrong selected first item').to.eql(item3)
            expect(selectedItems[1], 'Wrong selected second item').to.eql(item4)
            expect(selectedItems[2], 'Wrong selected third item').to.eql(item5)
          })

          it('should not have changed range state anchor', function () {
            expect(rangeState.anchor).to.eql(item3)
          })

          it('should have set range state endpoint', function () {
            expect(rangeState.endpoint).to.eql(item5)
          })
        })
      })
    //
    //   describe('key values are equal', function () {
    //     beforeEach(function () {
    //       selectedItems = A([{key1: 'foo', key2: 'qux'}])
    //       mixin.range(selectedItems, item, rangeState, itemKey)
    //     })
    //
    //     it('should have removed item from selectedItems', function () {
    //       expect(selectedItems).to.have.length(0)
    //     })
    //
    //     it('should have cleared range state anchor', function () {
    //       expect(rangeState.anchor).to.eql(null)
    //     })
    //
    //     it('should have cleared range state endpoint', function () {
    //       expect(rangeState.endpoint).to.eql(null)
    //     })
      // })
    })
  })

  describe('.itemComparator()', function () {
    describe('no item key', function () {
      ;[undefined, null, ''].forEach((key) => {
        describe(`key is '${key}'`, function () {
          it('should return false', function () {
            expect(mixin.itemComparator(key, {key1: 'foo', key2: 'bar'},
              {key1: 'foo', key2: 'qux'})).to.eql(false)
          })
        })
      })
    })

    describe('single item key', function () {
      describe('key values are equal', function () {
        it('should return true', function () {
          expect(mixin.itemComparator('key1', {key1: 'foo', key2: 'bar'},
            {key1: 'foo', key2: 'qux'})).to.eql(true)
        })
      })

      describe('key values are not equal', function () {
        it('should return false', function () {
          expect(mixin.itemComparator('key2', {key1: 'foo', key2: 'bar'},
            {key1: 'foo', key2: 'qux'})).to.eql(false)
        })
      })
    })

    describe('multiple item keys', function () {
      describe('both key values are equal', function () {
        it('should return true', function () {
          expect(mixin.itemComparator('key1,key2', {key1: 'foo', key2: 'bar'},
            {key1: 'foo', key2: 'bar'})).to.eql(true)
        })
      })

      describe('only one key value is equal', function () {
        it('should return false', function () {
          expect(mixin.itemComparator('key1,key2', {key1: 'foo', key2: 'bar'},
            {key1: 'foo', key2: 'qux'})).to.eql(false)
        })
      })

      describe('no key values are equal', function () {
        it('should return false', function () {
          expect(mixin.itemComparator('key1,key2', {key1: 'foo', key2: 'bar'},
            {key1: 'blah', key2: 'qux'})).to.eql(false)
        })
      })
    })
  })

  describe('.getColIndex()', function () {
    describe('selection is enabled', function () {
      beforeEach(function () {
        mixin.setProperties({onSelectionChange: () => {}})
      })

      it('should increment passed number', function () {
        expect(mixin.getColIndex(1)).to.eql(2)
      })
    })

    describe('selection is not enabled', function () {
      beforeEach(function () {
        mixin.setProperties({onSelectionChange: undefined})
      })

      it('should return passed number', function () {
        expect(mixin.getColIndex(1)).to.eql(1)
      })
    })
  })

  describe('.setShift()', function () {
    beforeEach(function () {
      mixin.set('isDestroyed', false)
    })

    describe('shift key is down', function () {
      beforeEach(function () {
        const event = {shiftKey: true}
        mixin.setShift(event)
      })

      it('should have set isShiftDown to true', function () {
        expect(mixin.get('isShiftDown')).to.eql(true)
      })
    })

    describe('shift key is not down', function () {
      beforeEach(function () {
        const event = {shiftKey: false}
        mixin.setShift(event)
      })

      it('should have set isShiftDown to true', function () {
        expect(mixin.get('isShiftDown')).to.eql(false)
      })
    })
  })
})
