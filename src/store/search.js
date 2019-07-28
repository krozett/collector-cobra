import types from 'types'

const SET_SEARCH_RESULTS = 'SET_RESULTS'

export const setSearchResults = results => ({
  type: SET_SEARCH_RESULTS,
  results
})

export const search = (state = {}, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        results: action.results
      }

    default:
      return state
  }
}

export const fetchResults = (name, query) => async (dispatch, state) => {
  const type = types[name]
  const url = type.searchURI(query)
  const response = await fetch(url)

  if (!response.ok) {
    window.alert(await response.text())
  }

  else {
    const json = await response.json()
    const results = type.searchTransform(json)

    dispatch(setSearchResults(results))
  }
}
