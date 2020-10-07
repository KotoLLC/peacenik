import { put, all, call, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
import { ApiTypes } from 'src/types'
import { Types as DashboardTypes } from '@store/dashboard/actions'
import selectors from '@selectors/index'

export function* watchGetMessageReports() {
  const state = yield select()
  const ownedHubs = selectors.profile.ownedHubs(state)

  yield all(ownedHubs.map(item => call(watchGetMessageReportsFromHub, {
    type: DashboardTypes.GET_MESSAGE_REPORTS_FROM_HUB_REQUEST,
    payload: item,
  })))
}

export function* watchGetMessageReportsFromHub(action: { type: string, payload: string }) {
  const response = yield API.dashboard.getMessageReports(action.payload)

  if (response.status === 200) {
    let resultData = []
    
    if (response.data?.reports?.length) {
      resultData = response.data?.reports.map(item => {
        item.sourceHost = action.payload
        return item
      })
    }

    yield put(Actions.dashboard.getMessageReportsFronHubSuccess(resultData))
  }
}

export function* watchResolveReport(action: { type: string, payload: ApiTypes.Dashboard.ResolveReport }) {
  const response = yield API.dashboard.resolveReport(action.payload)

  if (response.status === 200) {
    yield put(Actions.common.setSuccessNotify('Resolved successfully'))
    yield put(Actions.dashboard.getMessageReportsRequest())
  }
}

export function* watchDeleteReportedMessage(action: { type: string, payload: ApiTypes.Dashboard.DeleteReportedMessage }) {
  const response = yield API.dashboard.deleteReportedMessage(action.payload)

  if (response.status === 200) {
    yield put(Actions.common.setSuccessNotify('Deleted successfully'))
    yield put(Actions.dashboard.getMessageReportsRequest())
  }
}

export function* watchBlockReportedUser(action: { type: string, payload: ApiTypes.Dashboard.EjectUser }) {
  const response = yield API.dashboard.blockReportedUser(action.payload)

  if (response.status === 200) {
    yield put(Actions.dashboard.blockUserRequest(action.payload))
  }
}

export function* watchBlockUser(action: { type: string, payload: ApiTypes.Dashboard.EjectUser }) {
  const response = yield API.dashboard.blockUser(action.payload)

  if (response.status === 200) {
    yield put(Actions.common.setSuccessNotify('Blocked successfully'))
    yield put(Actions.dashboard.getMessageReportsRequest())
  } else {
    yield put(Actions.common.setErrorNotify(response?.error?.response?.data?.msg || 'Server error'))
  }
}