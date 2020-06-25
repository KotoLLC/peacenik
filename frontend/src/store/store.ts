import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '@sagas/index'

const rootReducer = combineReducers({})
const sagaMiddleware = createSagaMiddleware()

const createAppStore = () => {
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(
        sagaMiddleware,
    )))
    sagaMiddleware.run(rootSaga)
    return store
}

export default createAppStore()