const { HttpsError } = require('firebase-functions/v2/https')

const requireAuth = (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Unauthenticated')
  }
}

module.exports = requireAuth
