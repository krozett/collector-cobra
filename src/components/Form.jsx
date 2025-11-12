import React, { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DragHandle } from '@mui/icons-material'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from '@adalo/react-sortable-hoc'
import moment from 'moment'

import timestampToDate from '@/helpers/timestampToDate'
import parseDateUTC from '@/helpers/parseDateUTC'

function initialState(fields) {
  let state = {}

  fields.forEach((field) => {
    state[field.id] = field.value
  })

  return state
}

function Form({ fields, onSave }) {
  const [ item, setItem ] = useState(initialState(fields))

  const renderField = (field) => {
    switch (field.type) {
      case 'date':
        return renderDatePicker(field)
      case 'boolean':
        return renderCheckbox(field)
      case 'array':
        return renderSortable(field)
      default:
        return renderTextField(field)
    }
  }

  const renderDatePicker = (field) => {
    return (
      <LocalizationProvider key={field.id} dateAdapter={AdapterMoment}>
        <DatePicker
          label={field.label}
          defaultValue={moment(timestampToDate(field.value))}
          onChange={changeField(field)}
        />
      </LocalizationProvider>
    )
  }

  const renderCheckbox = (field) => {
    const checkbox = (
      <Checkbox
        defaultChecked={field.value}
        onChange={changeField(field)}
      />
    )

    return (
      <FormControlLabel
        key={field.id}
        label={field.label}
        control={checkbox}
      />
    )
  }

  const renderSortable = (field) => {
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

    return (
      <fieldset key={field.id}>
        <legend>
          {field.label}
        </legend>

        <SortableList
          useDragHandle
          fieldId={field.id}
          items={item[field.id] || []}
          subfields={subfields}
          onSortEnd={reorderRows}
        />

        <Button onClick={() => addRow(field)}>
          Add
        </Button>
      </fieldset>
    )
  }

  const renderTextField = (field) => {
    return (
      <TextField
        key={field.id}
        type={field.type}
        label={field.label}
        fullWidth={!field.inline}
        defaultValue={field.value}
        disabled={!!field.apiURI}
        onBlur={changeField(field)}
        onWheel={(event) => event.target.blur()}
      />
    )
  }

  const SortableList = SortableContainer(({ fieldId, items, subfields }) => {
    const elements = items.map((item, index) => (
      <SortableItem
        key={index}
        collection={fieldId}
        index={index}
        fieldId={fieldId}
        i={index}
        item={item}
        subfields={subfields}
      />
    ))

    return (
      <List>
        {elements}
      </List>
    )
  })

  const SortableItem = SortableElement(({ fieldId, i, item, subfields }) => {
    const inputs = subfields.map((subfield) => renderField({
      ...subfield,
      id: fieldId + '.' + i + '.' + subfield.id,
      value: item[subfield.id],
    }))

    return (
      <ListItem>
        <Handle />

        {inputs}

        <Button onClick={() => deleteRow(fieldId, i)}>
          Delete
        </Button>
      </ListItem>
    )
  })

  const Handle = SortableHandle(() => (
    <DragHandle />
  ))

  const changeField = (field) => {
    switch (field.type) {
      case 'date':
        return (newMoment) => {
          const newDate = parseDateUTC(newMoment.format('YYYY-MM-DD'))
          updateField(field.id, Timestamp.fromDate(newDate))
        }

      case 'boolean':
        return (event, checked) => {
          updateField(field.id, checked)
        }

      case 'number':
        return (event) => {
          const val = parseFloat(event.currentTarget.value, 10)
          updateField(field.id, isNaN(val) ? null : val)
        }

      default:
        return (event) => {
          updateField(field.id, event.currentTarget.value)
        }
    }
  }

  const updateField = (name, val) => {
    let newItem = { ...item }

    if (name.includes('.')) {
      const [ field, index, subfield ] = name.split('.')

      newItem[field] = item[field].map((item) => item)
      newItem[field][index][subfield] = val
    }

    else {
      newItem[name] = val
    }

    setItem(newItem)
  }

  const reorderRows = ({ oldIndex, newIndex, collection }) => {
    let newItem = { ...item }

    newItem[collection] = arrayMove(item[collection], oldIndex, newIndex)

    setItem(newItem)
  }

  const addRow = (field) => {
    let newItem = { ...item }

    newItem[field.id] = item[field.id].concat({})

    setItem(newItem)
  }

  const deleteRow = (fieldId, index) => {
    let newItem = { ...item }

    newItem[fieldId] = item[fieldId].filter((row, i) => i !== index)

    setItem(newItem)
  }

  const inputs = fields.map((field) => renderField(field))

  return (
    <Box>
      <p>{JSON.stringify(item)}</p>
      {inputs}

      <Button onClick={() => onSave(item)}>
        Save
      </Button>
    </Box>
  )
}

export default Form
