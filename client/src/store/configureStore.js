import createSagaMiddleware from 'redux-saga';
import {
    configureStore,
    combineReducers,
    getDefaultMiddleware,
} from '@reduxjs/toolkit';

import user from './reducers/user';
import leads from './reducers/leads';
import deals from './reducers/deals';
import notifications from './reducers/notifications';
import statistic from './reducers/statistic';
import tasks from './reducers/tasks';
import reports from './reducers/reports';
import foreman from './sagaForeman';

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
    user,
    leads,
    deals,
    notifications,
    statistic,
    tasks,
    reports,
});

const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
});
sagaMiddleware.run(foreman);

export default store;
