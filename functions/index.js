const logger = require('firebase-functions/logger')
const { onCall } = require('firebase-functions/v2/https')

const requireAuth = require('./helpers/requireAuth')
const apiSearch = require('./routes/apiSearch')
const apiFetch = require('./routes/apiFetch')

const privateFunction = (func) => onCall((request, response) => {
  requireAuth(request)
  return func(request)
})

logger.info('Ready to work!', { structuredData: true })

exports.apiSearch = privateFunction(apiSearch)
exports.apiFetch = privateFunction(apiFetch)
