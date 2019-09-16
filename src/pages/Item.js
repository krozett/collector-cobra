import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import types from 'types'
import { loadItem, saveItem } from 'store/collections'
import Form from 'components/Form'

class Item extends React.Component {
  componentDidMount() {
    const userID = this.props.user.uid
    this.props.loadItem(userID, this.props.collection, this.props.id)
  }

  render() {
    const collection = this.props.collections[this.props.collection]
    const item = collection && collection[this.props.id]

    if (!item || !item.loaded) {
      return null
    }
    else if (item.redirect) {
      return (
        <Redirect to={item.redirect} />
      )
    }

    const type = types[this.props.collection]
    const fields = type.fields.map(field => ({
      ...field,
      value: item[field.id]
    }))

    return (
      <Form
        fields={fields}
        returnURL={'/' + this.props.collection}
        onSubmit={this.submit}
      />
    )
  }

  submit = (formData) => {
    const userID = this.props.user.uid
    this.props.saveItem(userID, this.props.collection, this.props.id, formData)
  }
}

const mapStateToProps = state => ({
  collections: state.collections,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  loadItem: (userID, collection, id) => dispatch(
    loadItem(userID, collection, id)
  ),
  saveItem: (userID, collection, id, item) => dispatch(
    saveItem(userID, collection, id, item)
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Item)
