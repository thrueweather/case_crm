import { all, fork, takeLatest } from 'redux-saga/effects';
import watchUser from './reducers/user/saga';
import watchLeads from './reducers/leads/saga';
import watchDeals from './reducers/deals/saga';
import watchNotifications from './reducers/notifications/saga';
import watchFetchStatistic from './reducers/statistic/saga';
import watchFetchTasks from './reducers/tasks/saga';
import watchReports from './reducers/reports/saga'

const INIT_APP = 'INIT_APP';

export const initializeApp = () => ({ type: INIT_APP });

function* requestInitSaga() {
    try {
        yield console.log('requestInitSaga()');
        // yield put(rqAccount());
    } catch (e) {
        console.error('Fetching config failed', e);
    }
}

export function* watchRequestInit() {
    yield* [takeLatest(INIT_APP, requestInitSaga)];
}

export default function* startForeman() {
    yield all([
        fork(watchRequestInit),
        ...watchUser,
        ...watchLeads,
        ...watchDeals,
        ...watchNotifications,
        ...watchFetchStatistic,
        ...watchFetchTasks,
        ...watchReports,
    ]);
}
