import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '@sagas/index'
import registration from './registration'
import authorization from './authorization'
import friends from './friends'
import common from './common'
import nodes from './nodes'
import profile from './profile'
import messages from './messages'

const appReducer = combineReducers({
    registration,
    authorization,
    friends,
    common,
    nodes,
    profile,
    messages,
})

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_REQUEST') {
        state = undefined
    }

    return appReducer(state, action)
}

const sagaMiddleware = createSagaMiddleware()
const middlewares = composeWithDevTools(applyMiddleware(sagaMiddleware))
export const store = createStore(rootReducer, compose(...[middlewares]))

sagaMiddleware.run(rootSaga)