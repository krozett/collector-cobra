import React from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'

import { authInit } from 'store/user'

class Auth extends React.Component {
  constructor(props) {
    super(props)

    props.authInit()
  }

  render() {
    if (!this.props.user || !this.props.user.hasOwnProperty('isAnonymous')) {
      return (
        <div>loading...</div>
      )
    }

    if (this.props.user && this.props.user.isAnonymous) {
      return (
        <button onClick={this.signIn}>
          Log In with Google
        </button>
      )
    }

    return null
  }

  signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  authInit: () => dispatch(authInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
