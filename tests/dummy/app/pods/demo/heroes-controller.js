/**
 * Controller for providing heroes data
 */
import Ember from 'ember'
const {Controller, Logger, inject} = Ember

import heroes from 'dummy/heroes'

export default Controller.extend({
  heroes,

  notifier: inject.service(),

  actions: {
    dispatchNotification ({action, row, col, args}) {
      Logger.log('Dispatching: ', action, row, col, args)
      // This is where you would do your custom dispatching.
      const message = `(${action} ${row} ${col} ${args})`
      this.get('notifier').addNotification({
        message: message,
        type: 'success',
        autoClear: true
      })
    }
  }
})
