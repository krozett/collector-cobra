import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
} from 'firebase/firestore'
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

import Search from '@/components/Search'
import sortByField from '@/helpers/sortByField'
import types from '@/types'

function Collection({ name }) {
  const [ user, setUser ] = useState(null)
  const [ items, setItems ] = useState({})
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => {
      setUser(newUser)

      if (newUser) {
        loadCollection()
      }
    })
  }, [])

  const loadCollection = async () => {
    let docSnap
    let msg

    try {
      const db = getFirestore()
      const docRef = doc(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', 'lists', 'index-' + name + '-1')
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
      setItems(docSnap.data().entries)
    }
  }

  const addItem = async (item) => {
    try {
      const db = getFirestore()
      const collectionRef = collection(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', name)
      const indexRef = doc(db, 'users', 'WOB2mSgigDQZYTwL7MtrHfzY4vy1', 'lists', 'index-' + name + '-1')
      const indexEntry = types[name].generateIndexEntry(item)
      let entries = {}

      const itemRef = await addDoc(collectionRef, item)

      entries[itemRef.id] = {
        ...indexEntry,
        type: name,
      }

      await setDoc(indexRef, { entries }, { merge: true })

      let newItems = { ...items }
      newItems[itemRef.id] = indexEntry
      setItems(newItems)
    }

    catch (err) {
      window.alert(err.toString())
    }
  }

  if (!user) {
    return null
  }

  const listItems = sortByField(items, 'primaryText').map((key) => (
    <ListItem key={key}>
      <Link to={'/' + name + '/' + key}>
        <ListItemText
          primary={items[key].primaryText || ''}
          secondary={items[key].secondaryText}
        />
      </Link>
    </ListItem>
  ))

  return (
    <Box style={{ marginTop: '80px' }}>
      <Search name={name} onAddItem={addItem} />

      <List>
        {listItems}
      </List>
    </Box>
  )
}

export default Collection
