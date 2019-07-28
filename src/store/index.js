import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import { collections } from 'store/collections'
import { search } from 'store/search'
import { user } from 'store/user'

const rootReducer = combineReducers({
  collections,
  search,
  user
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
