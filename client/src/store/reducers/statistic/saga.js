import { call, put, takeLatest, all, fork } from 'redux-saga/effects';

import * as Action from './index';
import * as Api from 'api/repository';

function* fetchStatistic() {
    try {
        const statistic = yield call(Api.fetchStatistic);
        yield put(Action.fetchSuccessed(statistic));
    } catch (error) {
        yield put(Action.fetchFailed(error));
    }
}

// WATCHERS

export function* watchFetchStatistic() {
    yield* [takeLatest(Action.fetchStatistic.type, fetchStatistic)];
}

function* rootSagas() {
    yield all([watchFetchStatistic()]);
}

const sagas = [fork(rootSagas)];

export default sagas;
