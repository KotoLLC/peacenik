import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '@sagas/index'
import authorization from './authorization'
import friends from './friends'

const sagaMiddleware = createSagaMiddleware()
const rootReducer = combineReducers({
    authorization,
    friends,
})

const middlewares = composeWithDevTools(applyMiddleware(sagaMiddleware))
export const store = createStore(rootReducer, compose(...[middlewares]))

sagaMiddleware.run(rootSaga)