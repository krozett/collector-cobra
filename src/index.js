import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { initializeApp } from 'firebase/app'

import App from 'App'
import store from 'store'
import * as serviceWorker from 'serviceWorker'

import 'index.css'
import 'react-md/dist/react-md.green-deep_orange.min.css'

initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
})

// Allow functions URL base to be overridden
const emulatorURL = process.env.REACT_APP_FUNCTIONS_EMULATOR_URL
if (emulatorURL) {
  console.log('Using Firebase Functions emulator', emulatorURL)
//  firebase.functions().useFunctionsEmulator(emulatorURL)
}

const provider = (
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)

ReactDOM.render(provider, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
