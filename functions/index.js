const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })

// console.log(process.env.FUNCTIONS_EMULATOR === 'true')
// https://firebase.google.com/docs/functions/write-firebase-functions
// useFunctionsEmulator

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    response.send({ data: 'Hello from Firebase!', env: process.env, ver: process.version })
  })
})
