import { call, put, takeLatest, all, fork } from 'redux-saga/effects';

import * as Action from './index';
import * as Api from 'api/repository';

function* fetchDeals({ payload }) {
    try {
        const leads = yield call(
            Api.fetchDeals,
            payload && `?status=${payload}`
        );
        yield put(Action.fetchSuccessed(leads));
    } catch (error) {
        yield put(Action.fetchFailed(error));
    }
}

function* fetchStatuses() {
    try {
        const statuses = yield call(Api.getStatuses);
        yield put(Action.fetchStatusesSuccessed(statuses));
    } catch (error) {
        yield put(Action.fetchFailed(error));
    }
}

function* fetchProductForm() {
    try {
        const lenders = yield call(Api.getProductForm);
        yield put(Action.fetchProductFormSuccessed(lenders));
    } catch (error) {
        yield put(Action.fetchFailed(error));
    }
}

// WATCHERS

export function* watchFetchDeals() {
    yield* [takeLatest(Action.fetchDeals.type, fetchDeals)];
}

export function* watchFetchStatuses() {
    yield* [takeLatest(Action.fetchStatuses.type, fetchStatuses)];
}

export function* watchFetchProductForm() {
    yield* [takeLatest(Action.fetchProductForm.type, fetchProductForm)];
}

function* rootSagas() {
    yield all([
        watchFetchDeals(),
        watchFetchStatuses(),
        watchFetchProductForm(),
    ]);
}

const sagas = [fork(rootSagas)];

export default sagas;
