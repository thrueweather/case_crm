import { call, put, takeLatest, all, fork, select } from 'redux-saga/effects';


import * as Api from 'api/repository';
import * as action from './index';

function* fetchReports() {
    try {
        const {
            reports: { broker, dateRange, year, month, company },
        } = yield select();
        const response = yield call(
            Api.fetchReports,
            `?start=${dateRange.startDate ? dateRange.startDate.toDateString().split(' ').join('-') : ''
            }&end=${dateRange.endDate ? dateRange.endDate.toDateString().split(' ').join('-') : ''}&year=${year ? year.getFullYear() : ''}&month=${month ? (month.getMonth() + 1) : ''}&company_id=${company || ''}&broker_id=${broker || ''}`
        );
        yield put(action.fetchSuccessed(response));
    } catch (error) {
        yield put(action.fetchFailed(error));
    }
}

// WATCHERS

export function* watchFetchReports() {
    yield* [takeLatest(action.fetchReports.type, fetchReports)];
}

export function* watchResetFilters() {
    yield* [takeLatest(action.resetFilters.type, fetchReports)];
}

function* rootSagas() {
    yield all([
        watchFetchReports(),
        watchResetFilters(),
    ]);
}

const sagas = [fork(rootSagas)];

export default sagas;
