import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'

class App extends React.Component {
  render() {
    return (
      <>
        <CssBaseline />
        <p>Cobras!</p>
        <Button>clicko</Button>
        <DeleteIcon />
      </>
    )
  }
}

export default App
