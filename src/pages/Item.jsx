import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import { Box, Button } from '@mui/material'

import Form from '@/components/Form'
import Links from '@/components/Links'
import types from '@/types'

function Item({ name, id }) {
  const [ user, setUser ] = useState(null)
  const [ item, setItem ] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => {
      setUser(newUser)

      if (newUser) {
        loadItem()
      }
    })
  }, [])

  const loadItem = async () => {
    let docSnap
    let msg

    try {
      const db = getFirestore()
      const docRef = doc(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', name, id)
      docSnap = await getDoc(docRef)
    }
    catch (err) {
      msg = err.toString()
    }

    if (msg) {
      window.alert(msg)
    }
    else if (!docSnap.exists()) {
      window.alert('Item not found!')
    }
    else {
      setItem(docSnap.data())
    }
  }

  const saveItem = async (item) => {
    const db = getFirestore()
    const itemRef = doc(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', name, id)
    const indexRef = doc(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', 'lists', 'index-' + name + '-1')

    let entries = {}
    entries[id] = types[name].generateIndexEntry(item)

    await setDoc(itemRef, item, { merge: true })
    await setDoc(indexRef, { entries }, { merge: true })

    window.location = '/' + name
  }

  const confirmDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const db = getFirestore()
      const itemRef = doc(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', name, id)
      const indexRef = doc(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', 'lists', 'index-' + name + '-1')

      const indexDoc = await getDoc(indexRef)
      let indexData = indexDoc.data()
      delete indexData.entries[id]

      await deleteDoc(itemRef)
      await setDoc(indexRef, indexData)

      window.location = '/' + name
    }
  }

  if (!user || !item) {
    return null
  }

  const fields = types[name].fields.map((field) => ({
    ...field,
    value: item[field.id]
  }))

  return (
    <Box style={{ marginTop: '80px' }}>
      <Form fields={fields} onSave={saveItem} />

      <Button onClick={confirmDelete}>
        Delete
      </Button>

      <Links fields={fields} />
    </Box>
  )
}

export default Item
