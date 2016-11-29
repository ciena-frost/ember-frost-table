/**
 * Controller for the demo.overview route
 */
import Ember from 'ember'
const {Controller} = Ember

export default Controller.extend({
  queryParams: [
    'isInfoVisible'
  ],

  isInfoVisible: false
})
