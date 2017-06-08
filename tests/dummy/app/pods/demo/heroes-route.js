/**
 * Route for providing heroes data
 */

import Ember from 'ember'
const {RSVP, Route, inject} = Ember

export default Route.extend({
  store: inject.service(),

  model () {
    return RSVP.hash({
      characters: this.get('store').findAll('character')
    })
  }
})
