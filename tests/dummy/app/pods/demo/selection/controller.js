import Ember from 'ember'
const {A, Logger, inject} = Ember
import HeroesController from '../heroes-controller'

export default HeroesController.extend({
  // BEGIN-SNIPPET selection
  selectedItems: A([]),

  actions: {
    onSelectionChange (selectedItems) {
      this.get('selectedItems').setObjects(selectedItems)
    }
  }
  // END-SNIPPET
})
