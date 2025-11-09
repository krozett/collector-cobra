import React, { useState, useEffect } from 'react'
import { getFunctions, httpsCallable } from 'firebase/functions'
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
} from '@mui/material'

import types from '@/types'

function Search({ name, onAddItem }) {
  const [ query, setQuery ] = useState('')
  const [ page, setPage ] = useState(1)
  const [ results, setResults ] = useState([])
  const [ total, setTotal ] = useState(0)

  const search = async (nextPage) => {
    const functions = getFunctions()
    const apiSearch = httpsCallable(functions, 'apiSearch')

    try {
      const response = await apiSearch({ type: name, query, page: nextPage })
      const [ newResults, newTotal ] = types[name].searchTransform(response.data)

      setResults(newResults)
      setTotal(newTotal)
    }

    catch (err) {
      window.alert(err)
    }
  }

  const newSearch = () => {
    search(1)
    setPage(1)
  }

  const paginate = (event, nextPage) => {
    search(nextPage + 1)
    setPage(nextPage + 1)
  }

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      newSearch()
    }
  }

  const addItem = async (id) => {
    const functions = getFunctions()
    const apiFetch = httpsCallable(functions, 'apiFetch')

    try {
      const response = await apiFetch({ type: name, id })
      await onAddItem(types[name].fetchTransform(response.data))
      setResults(results.filter(result => result.id !== id))
      setTotal(total - 1)
    }

    catch (err) {
      window.alert(err)
    }
  }

  const addBlankItem = () => {
    onAddItem(types[name].blankItem)
  }

  const tableRows = results.map((result) => (
    <TableRow key={result.id}>
      <TableCell
        style={{ cursor: 'pointer' }}
        onClick={() => addItem(result.id)}
      >
        ADD
      </TableCell>
      <TableCell>
        {result.display}
      </TableCell>
      <TableCell>
        <a
          href={result.uri}
          target="_blank"
          rel="noopener noreferrer"
        >
          LINK
        </a>
      </TableCell>
    </TableRow>
  ))

  return (
    <Box>
      <TextField
        label={types[name].searchLabel}
        onChange={(event) => setQuery(event.currentTarget.value)}
        onKeyPress={onKeyPress}
      />
      <Button onClick={newSearch}>
        Search
      </Button>
      <Button onClick={addBlankItem}>
        Manual Entry
      </Button>

      <Table>
        <TableBody>
          {tableRows}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={total}
              page={page - 1}
              rowsPerPage={types[name].searchResultsPerPage}
              rowsPerPageOptions={[ 10, 20, 50, 100 ]}
              onPageChange={paginate}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Box>
  )
}

export default Search
