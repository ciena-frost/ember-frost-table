import Ember from 'ember'
const {A, Logger, inject} = Ember
import HeroesController from '../heroes-controller'

export default HeroesController.extend({
  selectedItems: A([]),
  notifier: inject.service(),
  actions: {
    dispatchNotifications ({action, row, col, args}) {
      Logger.log('Dispatching: ', action, row, col, args)
      // This is where you would do your custom dispatching.
      const message = `(${action} ${row} ${col} ${args})`
      this.get('notifier').addNotification({
        message: message,
        type: 'success',
        autoClear: true
      })
    },

    onSelectionChange (selectedItems) {
      this.get('selectedItems').setObjects(selectedItems)
    }
  }
})
