import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  List,
  ListItem,
  TextField,
  Button,
  FontIcon,
  DataTable,
  TableBody,
  TableRow,
  TableColumn,
  TablePagination
} from 'react-md'

import types from 'types'
import { loadCollection, createItem } from 'store/collections'
import { clearSearch, fetchSearchResults } from 'store/search'
import keysToFields from 'helpers/keysToFields'

class Collection extends React.Component {
  constructor() {
    super()

    this.state = {
      query: '',
      page: 1
    }
  }

  componentDidMount() {
    this.props.loadCollection(this.props.name)
    this.props.clearSearch(this.props.name)
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

        <Button raised onClick={this.newSearch}>
          Search
        </Button>

        {this.renderSearchResults()}
      </div>
    )
  }

  renderSearchResults() {
    const type = types[this.props.name]
    const results = this.props.search.results
    const total = this.props.search.total

    if (!results || !total) {
      return null
    }

    else if (results.length < 1) {
      return (
        <List>
          <ListItem primaryText="No results found." />
        </List>
      )
    }

    const rows = results.map((result) => {
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
        <TableRow key={result.id} selectable={false}>
          <TableColumn>
            {addIcon}
          </TableColumn>
          <TableColumn>
            {result.display}
          </TableColumn>
          <TableColumn>
            {link}
          </TableColumn>
        </TableRow>
      )
    })

    return (
      <DataTable baseId="search-results">
        <TableBody>
          {rows}
        </TableBody>
        <TablePagination
          rows={total}
          page={this.state.page}
          defaultRowsPerPage={type.searchResultsPerPage}
          rowsPerPageLabel=""
          onPagination={this.paginate}
        />
      </DataTable>
    )
  }

  changeQuery = text => {
    this.setState({
      query: text
    })
  }

  search = page => {
    this.props.fetchSearchResults(this.props.name, this.state.query, page)
  }

  newSearch = () => {
    this.search(1)
    this.setState({
      page: 1
    })
  }

  paginate = (newStart, rowsPerPage, currentPage) => {
    this.search(currentPage)
    this.setState({
      page: currentPage
    })
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
  clearSearch: () => dispatch(clearSearch()),
  fetchSearchResults: (collection, query, page) => dispatch(
    fetchSearchResults(collection, query, page)
  ),
  createItem: (collection, id) => dispatch(createItem(collection, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Collection)
