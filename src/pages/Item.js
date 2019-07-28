import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import types from 'types'
import { loadItem, saveItem } from 'store/collections'
import Form from 'components/Form'

class Item extends React.Component {
  componentDidMount() {
    this.props.loadItem(this.props.collection, this.props.id)
  }

  render() {
    const collection = this.props.collections[this.props.collection]
    const item = collection && collection[this.props.id]

    if (!item) {
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
    this.props.saveItem(this.props.collection, this.props.id, formData)
  }
}

const mapStateToProps = state => ({
  collections: state.collections
})

const mapDispatchToProps = dispatch => ({
  loadItem: (collection, id) => dispatch(loadItem(collection, id)),
  saveItem: (collection, id, item) => dispatch(
    saveItem(collection, id, item)
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Item)
