import { call, put, takeLatest, all, fork } from 'redux-saga/effects';


import * as Api from 'api/repository';
import * as action from './index';

function* fetchUser() {
    try {
        const user = yield call(Api.fetchUser);
        yield put(action.fetchSuccessed(user));
    } catch (error) {
        yield put(action.fetchFailed(error));
    }
}

// WATCHERS

export function* watchFetchUser() {
    yield* [takeLatest(action.fetchUser.type, fetchUser)];
}

function* rootSagas() {
    yield all([watchFetchUser()]);
}

const sagas = [fork(rootSagas)];

export default sagas;
