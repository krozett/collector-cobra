import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import firebase from 'firebase'

import App from 'App'
import config from 'config'
import store from 'store'
import * as serviceWorker from 'serviceWorker'

import 'index.css'
import 'react-md/dist/react-md.green-deep_orange.min.css'

firebase.initializeApp(config.firebase)
window.fb = firebase

const provider = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(provider, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
