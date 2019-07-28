import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, ListItem, TextField, Button, FontIcon } from 'react-md'

import types from 'types'
import { loadCollection, createItem } from 'store/collections'
import { fetchResults } from 'store/search'
import keysToFields from 'helpers/keysToFields'

class Collection extends React.Component {
  constructor() {
    super()

    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    this.props.loadCollection(this.props.name)
  }

  render() {
    const items = this.props.collections[this.props.name]

    if (!items) {
      return null
    }

    const type = types[this.props.name]
    const splitKeys = keysToFields(items, type.idFormat.sortBy)

    const listItems = splitKeys.map((id) => {
      let primaryText
      let secondaryText

      if (typeof type.idFormat.primaryText === 'function') {
        primaryText = type.idFormat.primaryText(id)
      }
      else {
        primaryText = id[type.idFormat.primaryText]
      }

      if (typeof type.idFormat.secondaryText === 'function') {
        secondaryText = type.idFormat.secondaryText(id)
      }
      else {
        secondaryText = id[type.idFormat.secondaryText]
      }

      return (
        <ListItem
          key={id[0]}
          component={Link}
          to={'/' + this.props.name + '/' + id[0]}
          primaryText={primaryText}
          secondaryText={secondaryText}
        />
      )
    })

    return (
      <div>
        <List>
          {listItems}
        </List>

        <TextField
          id="query"
          label={type.searchLabel}
          onChange={this.changeQuery}
        />

        <Button raised onClick={this.search}>
          Search
        </Button>

        {this.renderSearchResults()}
      </div>
    )
  }

  renderSearchResults() {
    if (!this.props.search.results) {
      return null
    }

    else if (this.props.search.results.length < 1) {
      return (
        <List>
          <ListItem primaryText="No results found." />
        </List>
      )
    }

    const listItems = this.props.search.results.map((result) => {
      const addIcon = (
        <FontIcon onClick={this.addResultGenerator(result.id)}>
          add
        </FontIcon>
      )

      const link = (
        <a href={result.uri} target="_blank" rel="noopener noreferrer">
          <FontIcon>
            link
          </FontIcon>
        </a>
      )

      return (
        <ListItem
          key={result.id}
          primaryText={result.display}
          leftIcon={addIcon}
          rightIcon={link}
        />
      )
    })

    return (
      <List>
        {listItems}
      </List>
    )
  }

  changeQuery = text => {
    this.setState({
      query: text
    })
  }

  search = () => {
    this.props.fetchResults(this.props.name, this.state.query)
  }

  addResultGenerator = id => () => {
    this.props.createItem(this.props.name, id)
  }
}

const mapStateToProps = state => ({
  collections: state.collections,
  search: state.search
})

const mapDispatchToProps = dispatch => ({
  loadCollection: collection => dispatch(loadCollection(collection)),
  fetchResults: (collection, query) => dispatch(
    fetchResults(collection, query)
  ),
  createItem: (collection, id) => dispatch(createItem(collection, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Collection)
