const functions = require('firebase-functions')

const requireAuth = require('./helpers/requireAuth')
const apiSearch = require('./routes/apiSearch')
const apiFetch = require('./routes/apiFetch')

// const cors = require('cors')({ origin: true })

// console.log(process.env.FUNCTIONS_EMULATOR === 'true')
// https://firebase.google.com/docs/functions/write-firebase-functions
// fb.functions().useFunctionsEmulator('http://babylon.invisibletokyo.com:8089')
// yarn serve -p 8089 -o 0.0.0.0
// response.send({ data: 'Hello from Firebase!', env: process.env, ver: process.version })
// cors(request, response, () => {

const privateFunction = func => (
  functions.https.onCall((data, context) => {
    requireAuth(context)
    return func(data)
  })
)

exports.apiSearch = privateFunction(apiSearch)
exports.apiFetch = privateFunction(apiFetch)
