/* global mocha */
import resolver from './helpers/resolver'
import {setResolver} from 'ember-mocha'

mocha.setup({
  timeout: 10000
})

setResolver(resolver)
