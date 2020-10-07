import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '@sagas/index'
import registration from './registration'
import authorization from './authorization'
import friends from './friends'
import common from './common'
import hubs from './hubs'
import profile from './profile'
import messages from './messages'
import notifications from './notifications'
import dashboard from './dashboard'

const appReducer = combineReducers({
    registration,
    authorization,
    friends,
    common,
    hubs,
    profile,
    messages,
    notifications,
    dashboard,
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