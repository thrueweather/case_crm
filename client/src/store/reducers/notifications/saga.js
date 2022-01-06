import { call, put, takeLatest, all, fork, select } from 'redux-saga/effects';

import * as action from './index';
import * as Api from 'api/repository';

function* fetchNotifications() {
    try {
        const {
            notifications: { activeTab, broker, date, statusType },
        } = yield select();
        const params = {
            read: true,
            unread: false,
        };
        const response = yield call(
            Api.fetchNotifications,
            `?readed=${params[activeTab]}&status_id=${statusType || ''}&date=${
                date ? date.toDateString().split(' ').join('-') : ''
            }&broker_id=${broker || ''}`
        );

        yield put(action.fetchSuccessed(response));
    } catch (error) {
        yield put(action.fetchFailed(error));
    }
}

// WATCHERS

export function* watchFetchNotifications() {
    yield* [takeLatest(action.fetchNotifications.type, fetchNotifications)];
}

export function* watchFetchNotificationsWithParams() {
    yield* [takeLatest(action.setActiveTab.type, fetchNotifications)];
}

export function* watchResetFilters() {
    yield* [takeLatest(action.resetFilters.type, fetchNotifications)];
}

function* rootSagas() {
    yield all([
        watchFetchNotifications(),
        watchFetchNotificationsWithParams(),
        watchResetFilters(),
    ]);
}

const sagas = [fork(rootSagas)];

export default sagas;
