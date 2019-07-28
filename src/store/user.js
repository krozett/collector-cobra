import firebase from 'firebase'

const SET_USER = 'SET_USER'
const UPDATE_USER = 'UPDATE_USER'

export const setUser = user => ({
  type: SET_USER,
  user
})

export const updateUser = user => ({
  type: UPDATE_USER,
  user
})

export const user = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user

    case UPDATE_USER:
      return {
        ...state,
        ...action.user
      }

    default:
      return state
  }
}

export const authInit = () => (dispatch, state) => {
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(updateUser(user))
    }
    else {
      dispatch(updateUser({
        isAnonymous: true
      }))
    }
  })

  dispatch(setUser({
    unsubscribe
  }))
}

export const logout = () => (dispatch, state) => {
  // First unsubscribe the auth state watcher to stop cascading events
  state().user.unsubscribe()

  // Next do the actual logout
  firebase.auth().signOut()

  // Finally send the user back to the index
  window.location = window.location.protocol + '//' + window.location.host
}
