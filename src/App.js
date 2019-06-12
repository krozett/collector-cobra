import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { NavigationDrawer, ListItem, FontIcon, Avatar } from 'react-md'

import { logout } from 'store/user'
import Franchises from 'pages/Franchises'
import Music from 'pages/Music'
import Auth from 'components/Auth'

class App extends React.Component {
  static routes = [{
    path: '/franchises',
    component: Franchises,
    label: 'Franchises',
    icon: 'collections'
  }, {
    path: '/music',
    component: Music,
    label: 'Music',
    icon: 'music_note'
  }]

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
    return App.routes.map((route) => {
      let icon = null
      if (route.icon) {
        icon = (
          <FontIcon>
            {route.icon}
          </FontIcon>
        )
      }

      return (
        <ListItem
          key={route.path}
          component={Link}
          to={route.path}
          primaryText={route.label}
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
        {this.renderRoutes()}
      </Switch>
    )
  }

  renderRoutes() {
    return App.routes.map(route => (
      <Route key={route.path} path={route.path} component={route.component} />
    ))
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
