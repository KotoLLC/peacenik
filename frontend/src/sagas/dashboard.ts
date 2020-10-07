import { put, all, call, select } from 'redux-saga/effects'
import Actions from '@store/actions'
import { API } from '@services/api'
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
    yield put(Actions.dashboard.getMessageReportsFronHubSuccess(response.data?.reports))
  }
}