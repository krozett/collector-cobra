import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { NavigationDrawer, ListItem } from 'react-md'

import Auth from 'components/Auth'

class App extends React.Component {
  render() {
    return (
      <NavigationDrawer
        navItems={[<ListItem primaryText="hissss" />]}
        toolbarTitle="Cobras!"
      >
        <Auth />

        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={() => <div>index</div>} />
            <Route path="/franchises" component={() => <div>franchises</div>} />
          </Switch>
        </BrowserRouter>
      </NavigationDrawer>
    )
  }
}

export default App
