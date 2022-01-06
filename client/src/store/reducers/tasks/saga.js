import { call, put, takeLatest, all, fork, select } from 'redux-saga/effects';


import * as Api from 'api/repository';
import * as action from './index';

function* fetchTasks() {
    try {
        const {
            tasks: { activeTab },
        } = yield select();
        const params = {
            all: '',
            toDo: false,
            completed: true,
        };
        const tasks = yield call(
            Api.fetchTasks,
            `?completed=${params[activeTab]}`
        );
        yield put(action.fetchSuccessed(tasks));
    } catch (error) {
        yield put(action.fetchFailed(error));
    }
}

// WATCHERS

export function* watchFetchTasks() {
    yield* [takeLatest(action.fetchTasks.type, fetchTasks)];
}

function* rootSagas() {
    yield all([watchFetchTasks()]);
}

const sagas = [fork(rootSagas)];

export default sagas;
