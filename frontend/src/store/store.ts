import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '@sagas/index'
import authorization from './authorization'
import friends from './friends'
import notify from './notify'
import nodes from './nodes'
import profile from './profile'

const appReducer = combineReducers({
    authorization,
    friends,
    notify,
    nodes,
    profile,
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