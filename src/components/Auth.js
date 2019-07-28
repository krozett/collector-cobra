import React from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { auth } from 'firebaseui'

import { authInit } from 'store/user'

class Auth extends React.Component {
  componentWillMount() {
    this.props.authInit()
  }

  render() {
    let loading = null

    if (!this.props.user || !this.props.user.hasOwnProperty('isAnonymous')) {
      loading = (
        <div>loading...</div>
      )
    }

    if (this.props.user && this.props.user.isAnonymous) {
      const ui = new auth.AuthUI(firebase.auth())

      ui.start('#firebaseui-auth-container', {
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => false
        }
      })
    }

    return (
      <>
        <div id="firebaseui-auth-container"></div>
        {loading}
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  authInit: () => dispatch(authInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
