import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import firebase from 'firebase'

import App from 'App'
import store from 'store'
import reportWebVitals from 'reportWebVitals'

import 'index.css'

firebase.initializeApp({
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
})

// Allow functions URL base to be overridden
const emulatorURL = process.env.REACT_APP_FUNCTIONS_EMULATOR_URL
if (emulatorURL) {
  console.log('Using Firebase Functions emulator', emulatorURL)
  firebase.functions().useFunctionsEmulator(emulatorURL)
}

const provider = (
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)

ReactDOM.render(provider, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
