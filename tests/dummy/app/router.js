import Ember from 'ember'
const {Router} = Ember
import config from './config/environment'

const DemoRouter = Router.extend({
  location: config.locationType
})

DemoRouter.map(function () {
  this.route('demo', {path: '/'}, function () {
    this.route('overview', {path: '/'})
    this.route('frost-fixed-table')
    this.route('frost-table')
    this.route('frost-table-body')
    this.route('frost-table-header')
    this.route('frost-table-row')
  })
})

export default DemoRouter
