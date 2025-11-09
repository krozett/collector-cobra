import React from 'react'
import { Box, Button } from '@mui/material'

function Links({ fields, item }) {
  let buttons = []

  fields.forEach((field) => {
    const val = field.value

    if (field.apiURI && val) {
      const url = field.apiURI(val)

      buttons.push(
        <Button key={url} href={url} target="_blank">
          View on {field.apiTitle}
        </Button>
      )
    }

    else if (field.links) {
      (val || []).forEach((link) => {
        if (link.uri) {
          buttons.push(
            <Button key={link.uri} href={link.uri} target="_blank">
              View on {link.title}
            </Button>
          )
        }
      })
    }
  })

  return (
    <Box>
      {buttons}
    </Box>
  )
}

export default Links
