import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { NavigationDrawer, ListItem, FontIcon, Avatar } from 'react-md'

import types from 'types'
import { logout } from 'store/user'
import Collection from 'pages/Collection'
import Item from 'pages/Item'
import Auth from 'components/Auth'

// icon: collections

const CollectionRouteComponent = props => (
  <Collection
    key={props.match.params.collection}
    name={props.match.params.collection}
  />
)

const ItemRouteComponent = props => (
  <Item
    collection={props.match.params.collection}
    id={encodeURI(props.match.params.id)}
  />
)

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <NavigationDrawer
          toolbarTitle="Collector Cobra"
          drawerTitle={this.renderUserTitle()}
          navItems={this.renderNavItems()}
        >
          <Auth />

          {this.renderRouter()}
        </NavigationDrawer>
      </BrowserRouter>
    )
  }

  renderUserTitle() {
    if (!this.props.user || this.props.user.isAnonymous !== false) {
      return null
    }

    return (
      <div onClick={this.props.logout}>
        <Avatar src={this.props.user.photoURL} />
        {' '}
        {this.props.user.displayName}
      </div>
    )
  }

  renderNavItems() {
    let keys = Object.keys(types)
    keys.sort()

    return keys.map((key) => {
      let type = types[key]

      const icon = (
        <FontIcon>
          {type.icon}
        </FontIcon>
      )

      return (
        <ListItem
          key={key}
          component={Link}
          to={'/' + key}
          primaryText={type.label}
          leftIcon={icon}
        />
      )
    })
  }

  renderRouter() {
    if (!this.props.user || this.props.user.isAnonymous !== false) {
      return null
    }

    return (
      <Switch>
        <Route exact path="/" component={() => <div>index</div>} />
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
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
