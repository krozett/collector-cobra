import React from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import firebaseui from 'firebaseui'

import { authInit, logout } from 'store/user'

class Auth extends React.Component {
  componentWillMount() {
    this.props.authInit()
  }

  render() {
    let loading = null

    if (!this.props.user) {
      loading = (
        <div>loading...</div>
      )
    }

    if (this.props.user && this.props.user.isAnonymous) {
      const ui = new firebaseui.auth.AuthUI(firebase.auth())

      ui.start('#firebaseui-auth-container', {
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => false
        }
      })
    }

let logout = null
    if (this.props.user && !this.props.user.isAnonymous) {
      logout = (
        <div onClick={this.props.logout}>
Hello, {this.props.user.displayName}!
</div>
      )
    }

    return (
      <>
        <div id="firebaseui-auth-container"></div>
        {loading}
        {logout}
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  authInit: () => dispatch(authInit),
  logout: () => dispatch(logout)
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
