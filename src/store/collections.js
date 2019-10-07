import firebase from 'firebase'

import types from 'types'

const SET_COLLECTION = 'SET_COLLECTION'
const SET_ITEM = 'SET_ITEM'

export const setCollection = collection => ({
  type: SET_COLLECTION,
  collection
})

export const setItem = (name, id, item) => ({
  type: SET_ITEM,
  name,
  id,
  item
})

export const collections = (state = {}, action) => {
  let newState = { ...state }

  switch (action.type) {
    case SET_COLLECTION:
      Object.keys(action.collection.entries).forEach((id) => {
        const entry = action.collection.entries[id]

        if (!newState.hasOwnProperty(entry.type)) {
          newState[entry.type] = {}
        }

        newState[entry.type][id] = {
          primaryText: entry.primaryText,
          secondaryText: entry.secondaryText,
          loaded: false
        }
      })

      return newState

    case SET_ITEM:
      if (!newState.hasOwnProperty(action.name)) {
        newState[action.name] = {}
      }

      newState[action.name][action.id] = {
        ...newState[action.name][action.id],
        ...action.item,
        loaded: true
      }

      return newState

    default:
      return state
  }
}

export const loadCollection = (userID, name) => async (dispatch, state) => {
  // The collection index is really just a special list document
  dispatch(loadItem(userID, 'lists', 'index-' + name + '-1'))
}

export const loadItem = (userID, name, id) => async (dispatch, state) => {
  let doc
  let msg

  try {
    const db = firebase.firestore()
    const collection = db.collection('users').doc(userID).collection(name)
    doc = await collection.doc(id).get()
  }
  catch (err) {
    msg = err.toString()
  }

  if (msg) {
    window.alert(msg)
  }
  else if (!doc.exists) {
    window.alert('Item not found!')
  }
  else if (id.startsWith('index-')) {
    dispatch(setCollection(doc.data()))
  }
  else {
    dispatch(setItem(name, id, doc.data()))
  }
}

export const saveItem = (userID, name, id, item) => async (dispatch, state) => {
  const type = types[name]
  const db = firebase.firestore()
  const userDoc = db.collection('users').doc(userID)
  const itemRef = userDoc.collection(name).doc(id)
  const indexRef = userDoc.collection('lists').doc('index-' + name + '-1')

  let entries = {}
  entries[id] = type.generateIndexEntry(item)

  await itemRef.set(item, { merge: true })
  await indexRef.set({ entries }, { merge: true })

  dispatch(setItem(name, id, { redirect: '/' + name }))
}

export const createItem = (userID, name, apiID) => async (dispatch, state) => {
  const type = types[name]
  const apiFetch = firebase.functions().httpsCallable('apiFetch')

  try {
    const response = await apiFetch({ type: name, id: apiID })
    const item = type.fetchTransform(response.data)

    const db = firebase.firestore()
    const userDoc = db.collection('users').doc(userID)
    const indexRef = userDoc.collection('lists').doc('index-' + name + '-1')

    const indexEntry = type.generateIndexEntry(item)
    const itemRef = await userDoc.collection(name).add(item)

    let entries = {}
    entries[itemRef.id] = {
      ...indexEntry,
      type: name
    }

    await indexRef.set({ entries }, { merge: true })

    dispatch(setItem(name, itemRef.id, {
      ...item,
      ...indexEntry
    }))
  }

  catch (err) {
    window.alert(err)
  }
}
