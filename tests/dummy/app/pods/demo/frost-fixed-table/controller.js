import HeroesController from '../heroes-controller'

export default HeroesController.extend({
  // notifier: inject.service(),
  actions: {
    dispatchNotifications (action, row, col, ...args) {
      // const message = `(${action} ${row} ${col} ${args})`
      // this.get('notifier').addNotification({
      //   message: message,
      //   type: 'success',
      //   autoClear: true
      // })
      console.log('Dispatching: ', action, row, col, args)
      // This is where you would be
    }
  }
})
