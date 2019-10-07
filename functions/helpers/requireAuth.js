const functions = require('firebase-functions')

const requireAuth = (context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthenticated')
  }
}

module.exports = requireAuth
