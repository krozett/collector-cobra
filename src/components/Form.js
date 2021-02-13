import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { DatePicker, Checkbox, TextField, FontIcon, Button } from 'react-md'
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from 'react-sortable-hoc'
import firebase from 'firebase'
import arrayMove from 'array-move'

import parseDateUTC from 'helpers/parseDateUTC'
import timestampToDate from 'helpers/timestampToDate'

const SortableContainer = sortableContainer(props => (
  <ul style={{ paddingLeft: 0 }}>
    {props.children}
  </ul>
))

const SortableItem = sortableElement(props => (
  <li style={{ listStyle: 'none' }}>
    <DragHandle />
    {props.children}
  </li>
))

const DragHandle = sortableHandle(props => (
  <FontIcon style={{ cursor: 'grab' }}>
    drag_handle
  </FontIcon>
))

class Form extends React.Component {
  constructor(props) {
    super(props)

    // Initialize state with existing field values
    let initialState = {}

    props.fields.forEach((field) => {
      initialState[field.id] = field.value
    })

    this.state = initialState
  }

  render() {
    const fields = this.props.fields.map(field => this.renderField(field))

    return (
      <div>
        {fields}

        <Button raised component={Link} to={this.props.returnURL}>
          Cancel
        </Button>
        <Button raised onClick={this.submit}>
          Save
        </Button>
        <Button raised onClick={this.confirmDelete}>
          Delete
        </Button>

        {this.renderExternalLinks()}
      </div>
    )
  }

  renderField(field) {
    switch (field.type) {
      case 'date':
        return this.renderDatePicker(field)
      case 'boolean':
        return this.renderCheckbox(field)
      case 'array':
        return this.renderSortable(field)
      default:
        return this.renderTextField(field)
    }
  }

  renderDatePicker(field) {
    return (
      <DatePicker
        key={field.id}
        id={field.id}
        name={field.id}
        label={field.label}
        leftIcon={this.renderIcon(field.icon)}
        className="md-inline-block"
        fullWidth={!field.inline}
        defaultValue={field.value && timestampToDate(field.value)}
        onChange={this.changeDateGenerator(field.id)}
      />
    )
  }

  renderCheckbox(field) {
    return (
      <Checkbox
        key={field.id}
        id={field.id}
        name={field.id}
        label={field.label}
        inline={field.inline}
        defaultChecked={field.value}
        onChange={this.changeField}
      />
    )
  }

  renderTextField(field) {
    let changeFunction = this.changeField

    if (field.type === 'number') {
      changeFunction = this.changeNumber
    }

    return (
      <TextField
        key={field.id}
        id={field.id}
        name={field.id}
        type={field.type}
        label={field.label}
        leftIcon={this.renderIcon(field.icon)}
        fullWidth={!field.inline}
        defaultValue={field.value}
        disabled={field.apiURI ? true : false}
        onChange={changeFunction}
      />
    )
  }

  renderSortable(field) {
    let subfields = field.subfields

    // If field contains links, assume title/uri subfields
    if (field.links) {
      subfields = [{
        id: 'title',
        type: 'text',
        label: 'Title',
        icon: 'title'
      }, {
        id: 'uri',
        type: 'url',
        label: 'URL',
        icon: 'link'
      }]
    }

    const rows = (this.state[field.id] || []).map((row, i) => {
      const key = Object.values(row).join('-') || i
      const fields = subfields.map(subfield => this.renderField({
        ...subfield,
        id: field.id + '.' + i + '.' + subfield.id,
        value: row[subfield.id],
        inline: true
      }))

      return (
        <SortableItem key={key} collection={field.id} index={i}>
          {fields}

          <Button icon={true} onClick={() => this.deleteRow(field, i)}>
            delete
          </Button>
        </SortableItem>
      )
    })

    return (
      <fieldset key={field.id}>
        <legend>
          {field.label}
        </legend>

        <SortableContainer useDragHandle onSortEnd={this.reorderRows}>
          {rows}
        </SortableContainer>

        <Button
          raised
          iconEl={this.renderIcon('add')}
          onClick={() => this.addRow(field)}
        >
          Add
        </Button>
      </fieldset>
    )
  }

  renderIcon(icon) {
    if (!icon) {
      return null
    }

    return (
      <FontIcon>
        {icon}
      </FontIcon>
    )
  }

  renderExternalLinks() {
    let buttons = []

    this.props.fields.forEach((field) => {
      const val = this.state[field.id]

      if (field.apiURI && val) {
        const url = field.apiURI(val)
        buttons.push(this.renderButton(field.apiTitle, url))
      }

      else if (field.links) {
        (val || []).forEach((link) => {
          if (link.uri) {
            buttons.push(this.renderButton(link.title, link.uri))
          }
        })
      }
    })

    return buttons
  }

  renderButton(title, uri) {
    return (
      <Button
        key={uri}
        href={uri}
        target="_blank"
        raised
        iconEl={this.renderIcon('link')}
      >
        View on {title}
      </Button>
    )
  }

  changeField = (val, event) => {
    let newState = {}
    let name = event.currentTarget.name

    if (name.includes('.')) {
      const [field, index, subfield] = name.split('.')

      this.setState((prevState) => {
        newState[field] = prevState[field].map(item => item)
        newState[field][index][subfield] = val
      })
    }

    else {
      newState[name] = val
      this.setState(newState)
    }
  }

  changeNumber = (val, event) => {
    const numericVal = parseFloat(val, 10)

    if (isNaN(numericVal)) {
      this.changeField(null, event)
    }
    else {
      this.changeField(numericVal, event)
    }
  }

  changeDateGenerator = id => (dateString, dateObject) => {
    const val = firebase.firestore.Timestamp.fromDate(
      parseDateUTC(dateObject)
    )

    this.changeField(val, {
      currentTarget: { name: id }
    })
  }

  reorderRows = (params, event) => {
    let newState = {}

    this.setState((prevState) => {
      newState[params.collection] = arrayMove(
        prevState[params.collection],
        params.oldIndex,
        params.newIndex
      )

      return newState
    })
  }

  addRow = field => {
    let newState = {}

    this.setState((prevState) => {
      newState[field.id] = prevState[field.id].concat({})

      return newState
    })
  }

  deleteRow = (field, index) => {
    let newState = {}

    this.setState((prevState) => {
      newState[field.id] = prevState[field.id].filter((row, i) => i !== index)

      return newState
    })
  }

  submit = () => {
    this.props.onSubmit(this.state)
  }

  confirmDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      this.props.onDelete()
    }
  }
}

Form.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    value: PropTypes.any,
    apiTitle: PropTypes.string,
    apiURI: PropTypes.func,
    links: PropTypes.bool,
    subfields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string
    }))
  })).isRequired,
  returnURL: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default Form
