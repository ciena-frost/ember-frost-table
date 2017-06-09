/**
 * Helpers for working with mirage
 */

import mirageInitializer from '../../initializers/ember-cli-mirage'
/* global server */

/**
 * @param {Number} [index=0] - the index into the handled request array to fetch
 * @returns {Request} the handled request by mirage
 */
export function getRequest (index = 0) {
  // if negative, start from the back
  if (index < 0) {
    index = server.pretender.handledRequests.length - 1 + index
  }
  return server.pretender.handledRequests[index]
}

/**
 * @param {String} [type=GET] - the type of HTTP request (verb)
 * @returns {Request} the handled request by mirage
 */
export function getLast (type = 'GET') {
  const len = server.pretender.handledRequests.length
  for (let i = len - 1; i >= 0; i--) {
    const req = server.pretender.handledRequests[i]
    if (req.method === type) {
      return req
    }
  }

  return null
}

/**
 * @returns {Request} the last handled request by mirage
 */
export function getLastRequest () {
  const index = server.pretender.handledRequests.length - 1
  return getRequest(index)
}

/**
 * Helper to allow using mirage in unit/integration tests
 * Taken from: http://www.ember-cli-mirage.com/docs/v0.1.x/manually-starting-mirage/
 * @param {*} container - the container you're running a test in
 */
export function startMirage (container) {
  mirageInitializer.initialize(container)
}

/**
 * Stop pretender instance
 */
export function stopMirage () {
  server.shutdown()
}
