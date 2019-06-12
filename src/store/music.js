import firebase from 'firebase'

const SET_MUSIC = 'SET_MUSIC'

export const setMusic = music => ({
  type: SET_MUSIC,
  music
})

export const music = (state = null, action) => {
  switch (action.type) {
    case SET_MUSIC:
      return action.music

    default:
      return state
  }
}

export const fetchMusic = async (dispatch, state) => {
  let docs = {}
  const db = firebase.firestore()
  const snapshot = await db.collection('music').get()

  snapshot.forEach((doc) => {
    docs[doc.id] = doc.data()
  })

  dispatch(setMusic(docs))
}
