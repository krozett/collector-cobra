import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  Avatar,
} from '@mui/material'
import { Menu } from '@mui/icons-material'

import types from '@/types'
import Collection from '@/pages/Collection'
import Item from '@/pages/Item'

const CollectionRouteComponent = (props) => (
  <Collection
    key={props.match.params.collection}
    name={props.match.params.collection}
  />
)

const ItemRouteComponent = (props) => (
  <Item
    name={props.match.params.collection}
    id={encodeURI(props.match.params.id)}
  />
)

function NavItems({ onClickItem }) {
  let keys = Object.keys(types)
  keys.sort()

  return keys.map((key) => (
    <ListItem key={key}>
      <Link to={'/' + key} onClick={onClickItem}>
        <ListItemButton>
          <ListItemText>
            {key}
          </ListItemText>
        </ListItemButton>
      </Link>
    </ListItem>
  ))
}

function App() {
  const [ userLoading, setUserLoading ] = useState(true)
  const [ user, setUser ] = useState(null)
  const [ drawerOpened, setDrawerOpened ] = useState(false)
  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  useEffect(() => {
    onAuthStateChanged(auth, (newUser) => {
      setUser(newUser)
      setUserLoading(false)
    })
  }, [])

  const handleDrawerToggle = () => {
    setDrawerOpened((prevState) => !prevState)
  }

  if (userLoading) {
    return (
      <CircularProgress />
    )
  }

  if (!user) {
    return (
      <Button onClick={() => signInWithPopup(auth, provider)}>
        Log In
      </Button>
    )
  }

  return (
    <BrowserRouter>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <Menu />
            </IconButton>
            <Typography sx={{ flexGrow: 1 }}>
              {user.displayName}
            </Typography>
            <IconButton onClick={() => signOut(auth)}>
              <Avatar src={user.photoURL} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <nav>
          <Drawer
            variant="temporary"
            open={drawerOpened}
            onClose={handleDrawerToggle}
          >
            <List>
              <NavItems onClickItem={handleDrawerToggle} />
            </List>
          </Drawer>
        </nav>

        <Box component="main">
          <Switch>
            <Route exact path="/" />
            <Route
              exact
              path="/:collection"
              component={CollectionRouteComponent}
            />
            <Route
              path="/:collection/:id"
              component={ItemRouteComponent}
            />
          </Switch>
        </Box>
      </Box>
    </BrowserRouter>
  )
}

export default App
