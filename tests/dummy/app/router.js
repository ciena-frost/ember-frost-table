import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location: config.locationType
})

Router.map(function () {
  this.route('demo', { path: '/' }, function () {
    this.route('overview', { path: '/' })
    this.route('frost-fixed-table')
    this.route('frost-table')
    this.route('frost-table-body')
    this.route('frost-table-header')
    this.route('frost-table-row')
  })
})

export default Router
