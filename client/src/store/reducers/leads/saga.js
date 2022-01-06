import { call, put, takeLatest, all, fork } from 'redux-saga/effects';


import * as Api from 'api/repository';
import * as action from './index';


function* fetchLeads() {
    try {
        const leads = yield call(Api.fetchLeads);
        yield put(action.fetchSuccessed(leads));
    } catch (error) {
        yield put(action.fetchFailed(error));
    }
}

// WATCHERS

export function* watchFetchLeads() {
    yield* [takeLatest(action.fetchLeads.type, fetchLeads)];
}

function* rootSagas() {
    yield all([watchFetchLeads()]);
}

const sagas = [fork(rootSagas)];

export default sagas;
