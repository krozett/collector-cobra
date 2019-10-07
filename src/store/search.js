import firebase from 'firebase'

import types from 'types'

const CLEAR_SEARCH = 'CLEAR_SEARCH'
const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS'
const SET_SEARCH_TOTAL = 'SET_SEARCH_TOTAL'

export const clearSearch = () => ({
  type: CLEAR_SEARCH
})

export const setSearchResults = results => ({
  type: SET_SEARCH_RESULTS,
  results
})

export const setSearchTotal = total => ({
  type: SET_SEARCH_TOTAL,
  total
})

export const search = (state = {}, action) => {
  switch (action.type) {
    case CLEAR_SEARCH:
      return {}

    case SET_SEARCH_RESULTS:
      return {
        ...state,
        results: action.results
      }

    case SET_SEARCH_TOTAL:
      return {
        ...state,
        total: action.total
      }

    default:
      return state
  }
}

export const fetchSearchResults = (name, query, page) => async (dispatch, state) => {
  const apiSearch = firebase.functions().httpsCallable('apiSearch')

  try {
    const response = await apiSearch({ type: name, query, page })
    const [results, total] = types[name].searchTransform(response.data)

    dispatch(setSearchResults(results))
    dispatch(setSearchTotal(total))
  }

  catch (err) {
    window.alert(err)
  }
}
