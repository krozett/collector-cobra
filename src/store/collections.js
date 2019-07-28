import firebase from 'firebase'

import types from 'types'
import generateID from 'helpers/generateID'

const SET_COLLECTION = 'SET_COLLECTION'
const SET_ITEM = 'SET_ITEM'

export const setCollection = (name, collection) => ({
  type: SET_COLLECTION,
  name,
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
      newState[action.name] = action.collection
      return newState

    case SET_ITEM:
      newState[action.name] = newState[action.name] || {}
      newState[action.name][action.id] = action.item
      return newState

    default:
      return state
  }
}

export const loadCollection = name => async (dispatch, state) => {
  const db = firebase.firestore()
  const snapshot = await db.collection(name).get()
  let docs = {}

  snapshot.forEach((doc) => {
    docs[doc.id] = null
  })

  dispatch(setCollection(name, docs))
}

export const loadItem = (name, id) => async (dispatch, state) => {
  const db = firebase.firestore()
  const doc = await db.collection(name).doc(id).get()

  if (!doc.exists) {
    window.alert('Item not found!')
  }

  else {
    let data = doc.data()
    dispatch(setItem(name, id, data))
  }
}

export const saveItem = (name, id, item) => async (dispatch, state) => {
  const db = firebase.firestore()
  const docRef = db.collection(name).doc(id)
  const newID = generateID(types[name], item)

  if (newID !== id) {
    const oldData = await (await docRef.get()).data()
    await db.collection(name).doc(newID).set({
      ...oldData,
      ...item
    })
    await docRef.delete()
  }

  else {
    await docRef.set(item, { merge: true })
  }

  dispatch(setItem(name, id, { redirect: '/' + name }))
}

export const createItem = (name, apiID) => async (dispatch, state) => {
  const type = types[name]
  const url = type.fetchURI(apiID)
  const response = await fetch(url)

  if (!response.ok) {
    window.alert(await response.text())
  }

  else {
    const db = firebase.firestore()
    const json = await response.json()
    const item = type.fetchTransform(json)
    const id = generateID(type, item)

    db.collection(name).doc(id).set(item)
    dispatch(setItem(name, id, null))
  }
}
